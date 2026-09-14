import { Router } from "express";

import { prisma } from "../lib/prisma";

export const postsRouter = Router();

postsRouter.get("/", async (_req, res) => {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
  });
  res.json(posts);
});

postsRouter.get("/:slug", async (req, res) => {
  const slug = String(req.params.slug ?? "");
  let post = await prisma.post.findFirst({
    where: { slug, published: true },
  });

  if (!post) {
    const redirect = await prisma.postRedirect.findUnique({
      where: { fromSlug: slug },
    });
    if (redirect) {
      post = await prisma.post.findFirst({
        where: { slug: redirect.toSlug, published: true },
      });
      if (post) {
        res.setHeader("X-Redirect-To", `/blogs/${post.slug}`);
        res.status(200).json({ ...post, redirectedFrom: slug });
        return;
      }
    }
    res.status(404).json({ error: "Post not found" });
    return;
  }

  const relatedIds = post.relatedPostIds ?? [];
  const relatedServiceIds = post.relatedServiceIds ?? [];

  const [relatedPosts, relatedServices] = await Promise.all([
    relatedIds.length
      ? prisma.post.findMany({
          where: { id: { in: relatedIds }, published: true },
          select: {
            id: true,
            slug: true,
            title: true,
            excerpt: true,
            coverImage: true,
            tag: true,
            coverImageAlt: true,
          },
        })
      : Promise.resolve([]),
    relatedServiceIds.length
      ? prisma.service.findMany({
          where: { id: { in: relatedServiceIds }, published: true },
          select: {
            id: true,
            slug: true,
            audience: true,
            title: true,
            tagline: true,
          },
        })
      : Promise.resolve([]),
  ]);

  res.json({ ...post, relatedPosts, relatedServices });
});
