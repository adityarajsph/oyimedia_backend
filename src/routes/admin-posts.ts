import { Router } from "express";

import { prisma } from "../lib/prisma";
import { slugify } from "../lib/slugify";
import { imageUpload } from "../lib/upload";
import { requireAdmin } from "../middleware/auth";

export const adminPostsRouter = Router();

adminPostsRouter.use(requireAdmin);

adminPostsRouter.get("/", async (_req, res) => {
  const posts = await prisma.post.findMany({
    orderBy: { updatedAt: "desc" },
  });
  res.json(posts);
});

adminPostsRouter.get("/:id", async (req, res) => {
  const post = await prisma.post.findUnique({
    where: { id: req.params.id },
  });
  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  res.json(post);
});

adminPostsRouter.post("/", async (req, res) => {
  const title = String(req.body?.title ?? "").trim();
  if (!title) {
    res.status(400).json({ error: "Title is required" });
    return;
  }

  const slug = slugify(String(req.body?.slug || title));
  const published = Boolean(req.body?.published);

  try {
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt: String(req.body?.excerpt ?? "").trim(),
        body: String(req.body?.body ?? "").trim(),
        coverImage: String(req.body?.coverImage ?? "").trim(),
        tag: String(req.body?.tag ?? "").trim(),
        author: String(req.body?.author ?? "").trim(),
        featured: Boolean(req.body?.featured),
        published,
        publishedAt: published ? new Date() : null,
      },
    });
    res.status(201).json(post);
  } catch {
    res.status(409).json({ error: "A post with that slug already exists" });
  }
});

adminPostsRouter.put("/:id", async (req, res) => {
  const title = String(req.body?.title ?? "").trim();
  if (!title) {
    res.status(400).json({ error: "Title is required" });
    return;
  }

  const existing = await prisma.post.findUnique({
    where: { id: req.params.id },
  });
  if (!existing) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  const published = Boolean(req.body?.published);

  try {
    const post = await prisma.post.update({
      where: { id: req.params.id },
      data: {
        title,
        slug: slugify(String(req.body?.slug || title)),
        excerpt: String(req.body?.excerpt ?? "").trim(),
        body: String(req.body?.body ?? "").trim(),
        coverImage:
          String(req.body?.coverImage ?? "").trim() || existing.coverImage,
        tag: String(req.body?.tag ?? "").trim(),
        author: String(req.body?.author ?? "").trim(),
        featured: Boolean(req.body?.featured),
        published,
        publishedAt: published
          ? (existing.publishedAt ?? new Date())
          : null,
      },
    });
    res.json(post);
  } catch {
    res.status(409).json({ error: "A post with that slug already exists" });
  }
});

adminPostsRouter.delete("/:id", async (req, res) => {
  try {
    await prisma.post.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch {
    res.status(404).json({ error: "Post not found" });
  }
});

adminPostsRouter.patch("/:id/publish", async (req, res) => {
  const existing = await prisma.post.findUnique({
    where: { id: req.params.id },
  });
  if (!existing) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  const published = Boolean(req.body?.published);
  const post = await prisma.post.update({
    where: { id: req.params.id },
    data: {
      published,
      publishedAt: published ? (existing.publishedAt ?? new Date()) : null,
    },
  });
  res.json(post);
});

adminPostsRouter.post("/:id/image", imageUpload.single("image"), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "Image file is required" });
    return;
  }

  const existing = await prisma.post.findUnique({
    where: { id: req.params.id },
  });
  if (!existing) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  const coverImage = `/uploads/${req.file.filename}`;
  const post = await prisma.post.update({
    where: { id: req.params.id },
    data: { coverImage },
  });
  res.json(post);
});
