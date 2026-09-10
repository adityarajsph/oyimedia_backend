import { Router } from "express";

import { prisma } from "../lib/prisma";
import { slugify } from "../lib/slugify";
import { imageUpload, storeImage } from "../lib/upload";
import { requireAdmin } from "../middleware/auth";

export const adminServicesRouter = Router();

adminServicesRouter.use(requireAdmin);

function payload(body: Record<string, unknown>, title: string) {
  const audience =
    String(body.audience ?? "brand") === "creators" ? "creators" : "brand";
  return {
    title,
    slug: slugify(String(body.slug || title)),
    audience,
    tagline: String(body.tagline ?? "").trim(),
    excerpt: String(body.excerpt ?? "").trim(),
    body: String(body.body ?? "").trim(),
    image: String(body.image ?? "").trim(),
    video: String(body.video ?? "").trim(),
    sortOrder: Number(body.sortOrder ?? 0) || 0,
    published: Boolean(body.published),
  };
}

adminServicesRouter.get("/", async (_req, res) => {
  const items = await prisma.service.findMany({
    orderBy: [{ audience: "asc" }, { sortOrder: "asc" }, { updatedAt: "desc" }],
  });
  res.json(items);
});

adminServicesRouter.get("/:id", async (req, res) => {
  const item = await prisma.service.findUnique({
    where: { id: req.params.id },
  });
  if (!item) {
    res.status(404).json({ error: "Service not found" });
    return;
  }
  res.json(item);
});

adminServicesRouter.post("/", async (req, res) => {
  const title = String(req.body?.title ?? "").trim();
  if (!title) {
    res.status(400).json({ error: "Title is required" });
    return;
  }
  try {
    const item = await prisma.service.create({
      data: payload(req.body as Record<string, unknown>, title),
    });
    res.status(201).json(item);
  } catch {
    res.status(409).json({ error: "A service with that slug already exists for this desk" });
  }
});

adminServicesRouter.put("/:id", async (req, res) => {
  const title = String(req.body?.title ?? "").trim();
  if (!title) {
    res.status(400).json({ error: "Title is required" });
    return;
  }
  const existing = await prisma.service.findUnique({
    where: { id: req.params.id },
  });
  if (!existing) {
    res.status(404).json({ error: "Service not found" });
    return;
  }
  try {
    const data = payload(req.body as Record<string, unknown>, title);
    const item = await prisma.service.update({
      where: { id: req.params.id },
      data: { ...data, image: data.image || existing.image },
    });
    res.json(item);
  } catch {
    res.status(409).json({ error: "A service with that slug already exists for this desk" });
  }
});

adminServicesRouter.delete("/:id", async (req, res) => {
  try {
    await prisma.service.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch {
    res.status(404).json({ error: "Service not found" });
  }
});

adminServicesRouter.patch("/:id/publish", async (req, res) => {
  try {
    const item = await prisma.service.update({
      where: { id: req.params.id },
      data: { published: Boolean(req.body?.published) },
    });
    res.json(item);
  } catch {
    res.status(404).json({ error: "Service not found" });
  }
});

adminServicesRouter.post(
  "/:id/image",
  imageUpload.single("image"),
  async (req, res) => {
    if (!req.file) {
      res.status(400).json({ error: "Image file is required" });
      return;
    }
    try {
      const image = await storeImage(req.file);
      const item = await prisma.service.update({
        where: { id: req.params.id },
        data: { image },
      });
      res.json(item);
    } catch {
      res.status(404).json({ error: "Service not found" });
    }
  }
);
