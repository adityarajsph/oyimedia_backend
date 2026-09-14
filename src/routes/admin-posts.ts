import type { Prisma } from "@prisma/client";
import { Router } from "express";

import { checkLinks } from "../lib/links";
import { postSeoFields } from "../lib/post-fields";
import { prisma } from "../lib/prisma";
import { parseSnapshot, saveRevision } from "../lib/revisions";
import { slugify } from "../lib/slugify";
import { imageUpload, storeImage } from "../lib/upload";
import { requireAdmin } from "../middleware/auth";

export const adminPostsRouter = Router();

adminPostsRouter.use(requireAdmin);

function publishState(body: Record<string, unknown>) {
  let published = Boolean(body.published);
  const seo = postSeoFields({ ...body, published });
  if (seo.scheduledAt && seo.scheduledAt.getTime() <= Date.now()) {
    published = true;
    seo.scheduledAt = null;
  }
  if (seo.scheduledAt) published = false;
  return { published, seo };
}

function coreFields(body: Record<string, unknown>, title: string) {
  const { published, seo } = publishState(body);
  return {
    title,
    slug: slugify(String(body.slug || title)),
    excerpt: String(body.excerpt ?? "").trim(),
    body: String(body.body ?? "").trim(),
    coverImage: String(body.coverImage ?? "").trim(),
    tag: String(body.tag ?? "").trim(),
    author: String(body.author ?? "").trim(),
    featured: Boolean(body.featured),
    published,
    ...seo,
  };
}

async function linkLookup() {
  const [posts, services] = await Promise.all([
    prisma.post.findMany({ select: { slug: true } }),
    prisma.service.findMany({ select: { slug: true, audience: true } }),
  ]);
  return {
    blogSlugs: new Set(posts.map((post) => post.slug)),
    servicePaths: new Set(
      services.map((service) => `/services/${service.audience}/${service.slug}`)
    ),
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

  const data = coreFields(req.body as Record<string, unknown>, title);

  try {
    const post = await prisma.post.create({
      data: {
        ...data,
        publishedAt: data.published ? new Date() : null,
      },
    });
    await saveRevision(post);
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

  await saveRevision(existing);
  const data = coreFields(req.body as Record<string, unknown>, title);
  const slugChanged = data.slug !== existing.slug;

  try {
    const post = await prisma.post.update({
      where: { id: req.params.id },
      data: {
        ...data,
        coverImage: data.coverImage || existing.coverImage,
        publishedAt: data.published ? (existing.publishedAt ?? new Date()) : null,
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
      scheduledAt: published ? null : existing.scheduledAt,
    },
  });
  res.json(post);
});

adminPostsRouter.post("/check-links", async (req, res) => {
  const html = String(req.body?.html ?? "");
  const results = await checkLinks(html, await linkLookup());
  res.json({ results });
});

adminPostsRouter.post("/:id/check-links", async (req, res) => {
  const post = await prisma.post.findUnique({
    where: { id: req.params.id },
    select: { body: true },
  });
  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  const html = String(req.body?.html ?? post.body);
  const results = await checkLinks(html, await linkLookup());
  res.json({ results });
});

adminPostsRouter.get("/:id/revisions", async (req, res) => {
  const post = await prisma.post.findUnique({
    where: { id: req.params.id },
    select: { id: true },
  });
  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  const revisions = await prisma.postRevision.findMany({
    where: { postId: req.params.id },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  res.json(
    revisions.map((revision) => {
      let title = "";
      try {
        title = String(
          (JSON.parse(revision.snapshot) as { title?: string }).title ?? ""
        );
      } catch {
        title = "";
      }
      return {
        id: revision.id,
        createdAt: revision.createdAt,
        title,
      };
    })
  );
});

adminPostsRouter.post("/:id/revisions/:revisionId/restore", async (req, res) => {
  const existing = await prisma.post.findUnique({
    where: { id: req.params.id },
  });
  if (!existing) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  const revision = await prisma.postRevision.findFirst({
    where: { id: req.params.revisionId, postId: req.params.id },
  });
  if (!revision) {
    res.status(404).json({ error: "Revision not found" });
    return;
  }

  let snapshot: Record<string, unknown>;
  try {
    snapshot = parseSnapshot(revision.snapshot);
  } catch {
    res.status(400).json({ error: "Revision snapshot is invalid" });
    return;
  }

  await saveRevision(existing);
  const post = await prisma.post.update({
    where: { id: req.params.id },
    data: snapshot as Prisma.PostUpdateInput,
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
