import { Router } from "express";

import { postSeoFields } from "../lib/post-fields";
import { prisma } from "../lib/prisma";
import { slugify } from "../lib/slugify";
import { imageUpload, storeImage } from "../lib/upload";
import { requireAdmin } from "../middleware/auth";

export const adminPostsRouter = Router();

adminPostsRouter.use(requireAdmin);

function coreFields(body: Record<string, unknown>, title: string) {
  return {
    title,
    slug: slugify(String(body.slug || title)),
    excerpt: String(body.excerpt ?? "").trim(),
    body: String(body.body ?? "").trim(),
    coverImage: String(body.coverImage ?? "").trim(),
    tag: String(body.tag ?? "").trim(),
    author: String(body.author ?? "").trim(),
    featured: Boolean(body.featured),
    ...postSeoFields(body),
  };
}

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

  const published = Boolean(req.body?.published);
  const data = coreFields(req.body as Record<string, unknown>, title);

  try {
    const post = await prisma.post.create({
      data: {
        ...data,
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
  const data = coreFields(req.body as Record<string, unknown>, title);
  const slugChanged = data.slug !== existing.slug;

  try {
    const post = await prisma.post.update({
      where: { id: req.params.id },
      data: {
        ...data,
        coverImage: data.coverImage || existing.coverImage,
        published,
        publishedAt: published ? (existing.publishedAt ?? new Date()) : null,
      },
    });

    if (slugChanged && existing.published) {
      await prisma.postRedirect.upsert({
        where: { fromSlug: existing.slug },
        update: { toSlug: post.slug },
        create: { fromSlug: existing.slug, toSlug: post.slug },
      });
    }

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

  const coverImage = await storeImage(req.file);
  const post = await prisma.post.update({
    where: { id: req.params.id },
    data: { coverImage },
  });
  res.json(post);
});
