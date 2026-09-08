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
  const post = await prisma.post.findFirst({
    where: { slug: req.params.slug, published: true },
  });

  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  res.json(post);
});
