const SITE_PAGES = new Set([
  "/",
  "/about",
  "/contact",
  "/influencers",
  "/portfolio",
  "/blogs",
  "/services",
  "/services/brand",
  "/services/creators",
]);

export type LinkCheck = {
  href: string;
  text: string;
  kind: "internal" | "external";
  ok: boolean;
  status: number | null;
  detail: string;
};

export function extractLinks(html: string) {
  const links: { href: string; text: string }[] = [];
  const pattern = /<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(html))) {
    const href = match[1].trim();
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
      continue;
    }
    links.push({
      href,
      text: match[2].replace(/<[^>]+>/g, "").trim() || href,
    });
  }
  return links;
}

function isInternal(href: string) {
  return (
    href.startsWith("/") ||
    /oyimedia\.com/i.test(href)
  );
}

function pathFromHref(href: string) {
  if (href.startsWith("/")) return href.split("?")[0];
  try {
    return new URL(href).pathname;
  } catch {
    return href;
  }
}

export async function checkLinks(
  html: string,
  lookup: {
    blogSlugs: Set<string>;
    servicePaths: Set<string>;
  }
): Promise<LinkCheck[]> {
  const seen = new Set<string>();
  const results: LinkCheck[] = [];

  for (const link of extractLinks(html)) {
    if (seen.has(link.href)) continue;
    seen.add(link.href);

    if (isInternal(link.href)) {
      const pathname = pathFromHref(link.href);
      const blog = pathname.match(/^\/blogs\/([^/]+)\/?$/);
      const service = pathname.match(/^\/services\/(brand|creators)\/([^/]+)\/?$/);
      let ok = SITE_PAGES.has(pathname);
      let detail = ok ? "Known site page" : "Unknown internal path";
      if (blog) {
        ok = lookup.blogSlugs.has(blog[1]);
        detail = ok ? "Published blog" : "Blog slug not found";
      } else if (service) {
        const key = `/services/${service[1]}/${service[2]}`;
        ok = lookup.servicePaths.has(key);
        detail = ok ? "Published service" : "Service not found";
      }
      results.push({
        href: link.href,
        text: link.text,
        kind: "internal",
        ok,
        status: ok ? 200 : 404,
        detail,
      });
      continue;
    }

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 6000);
      const response = await fetch(link.href, {
        method: "HEAD",
        redirect: "follow",
        signal: controller.signal,
      }).catch(() =>
        fetch(link.href, {
          method: "GET",
          redirect: "follow",
          signal: controller.signal,
        })
      );
      clearTimeout(timer);
      const ok = response.ok;
      results.push({
        href: link.href,
        text: link.text,
        kind: "external",
        ok,
        status: response.status,
        detail: ok ? "Reachable" : `HTTP ${response.status}`,
      });
    } catch (error) {
      results.push({
        href: link.href,
        text: link.text,
        kind: "external",
        ok: false,
        status: null,
        detail: error instanceof Error ? error.message : "Unreachable",
      });
    }
  }

  return results;
}
