import { Router } from "express";

import { prisma } from "../lib/prisma";
import { requireAdmin } from "../middleware/auth";

export const adminSearchRouter = Router();

adminSearchRouter.use(requireAdmin);

const SITE_PAGES = [
  { title: "Home", url: "/", type: "page" },
  { title: "About", url: "/about", type: "page" },
  { title: "Contact", url: "/contact", type: "page" },
  { title: "Influencers", url: "/influencers", type: "page" },
  { title: "Portfolio", url: "/portfolio", type: "page" },
  { title: "Blogs", url: "/blogs", type: "page" },
  { title: "Services", url: "/services", type: "page" },
  { title: "For Brands", url: "/services/brand", type: "page" },
  { title: "For Creators", url: "/services/creators", type: "page" },
];

adminSearchRouter.get("/pages", async (req, res) => {
  const q = String(req.query.q ?? "").trim().toLowerCase();
  const [posts, services] = await Promise.all([
    prisma.post.findMany({
      select: { id: true, title: true, slug: true, published: true, tag: true },
      orderBy: { updatedAt: "desc" },
      take: 80,
    }),
    prisma.service.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        audience: true,
        published: true,
      },
      orderBy: { updatedAt: "desc" },
      take: 80,
    }),
  ]);

  const match = (value: string) => !q || value.toLowerCase().includes(q);
  const matchedPosts = posts
    .filter(
      (post) => match(post.title) || match(post.slug) || match(post.tag)
    )
    .slice(0, 20);
  const matchedServices = services
    .filter((service) => match(service.title) || match(service.slug))
    .slice(0, 20);

  const pages = SITE_PAGES.filter(
    (page) =>
      !q ||
      page.title.toLowerCase().includes(q) ||
      page.url.toLowerCase().includes(q)
  );

  res.json({
    pages,
    blogs: matchedPosts.map((post) => ({
      id: post.id,
      title: post.title,
      url: `/blogs/${post.slug}`,
      type: "blog",
      published: post.published,
    })),
    services: matchedServices.map((service) => ({
      id: service.id,
      title: `${service.title} (${service.audience})`,
      url: `/services/${service.audience}/${service.slug}`,
      type: "service",
      published: service.published,
    })),
  });
});
