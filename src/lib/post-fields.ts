function text(body: Record<string, unknown>, key: string) {
  return String(body[key] ?? "").trim();
}

function flag(body: Record<string, unknown>, key: string, fallback = true) {
  const value = body[key];
  if (value === false || value === "false" || value === 0 || value === "0") {
    return false;
  }
  if (value === true || value === "true" || value === 1 || value === "1") {
    return true;
  }
  return fallback;
}

function ids(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item ?? "").trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [] as string[];
}

export function postSeoFields(body: Record<string, unknown>) {
  const schemaType =
    text(body, "schemaType") === "Article" ? "Article" : "BlogPosting";
  const twitterCard =
    text(body, "twitterCard") === "summary" ? "summary" : "summary_large_image";

  return {
    coverImageAlt: text(body, "coverImageAlt"),
    coverImageTitle: text(body, "coverImageTitle"),
    coverImageCaption: text(body, "coverImageCaption"),
    coverImageDescription: text(body, "coverImageDescription"),
    tags: text(body, "tags"),
    seoTitle: text(body, "seoTitle"),
    metaDescription: text(body, "metaDescription"),
    canonicalUrl: text(body, "canonicalUrl"),
    focusKeyword: text(body, "focusKeyword"),
    secondaryKeywords: text(body, "secondaryKeywords"),
    ogTitle: text(body, "ogTitle"),
    ogDescription: text(body, "ogDescription"),
    ogImage: text(body, "ogImage"),
    twitterTitle: text(body, "twitterTitle"),
    twitterDescription: text(body, "twitterDescription"),
    twitterImage: text(body, "twitterImage"),
    twitterCard,
    robotsIndex: flag(body, "robotsIndex", true),
    robotsFollow: flag(body, "robotsFollow", true),
    schemaType,
    tocEnabled: flag(body, "tocEnabled", true),
    relatedPostIds: ids(body.relatedPostIds),
    relatedServiceIds: ids(body.relatedServiceIds),
  };
}
