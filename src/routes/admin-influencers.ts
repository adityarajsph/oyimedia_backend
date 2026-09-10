import { Router } from "express";

import { prisma } from "../lib/prisma";
import { slugify } from "../lib/slugify";
import { imageUpload, storeImage } from "../lib/upload";
import { requireAdmin } from "../middleware/auth";

export const adminInfluencersRouter = Router();

adminInfluencersRouter.use(requireAdmin);

function payload(body: Record<string, unknown>, name: string) {
  const region =
    String(body.region ?? "india") === "international"
      ? "international"
      : "india";
  return {
    name,
    slug: slugify(String(body.slug || name)),
    bio: String(body.bio ?? "").trim(),
    category: String(body.category ?? "").trim(),
    region,
    location: String(body.location ?? "").trim(),
    followers: String(body.followers ?? "").trim(),
    platform: String(body.platform ?? "Instagram").trim() || "Instagram",
    image: String(body.image ?? ""),
    rating: String(body.rating ?? "5.0").trim() || "5.0",
    featured: Boolean(body.featured),
    published: Boolean(body.published),
  };
}

adminInfluencersRouter.get("/", async (_req, res) => {
  const items = await prisma.influencer.findMany({
    orderBy: { updatedAt: "desc" },
  });
  res.json(items);
});

adminInfluencersRouter.get("/:id", async (req, res) => {
  const item = await prisma.influencer.findUnique({
    where: { id: req.params.id },
  });
  if (!item) {
    res.status(404).json({ error: "Influencer not found" });
    return;
  }
  res.json(item);
});

adminInfluencersRouter.post("/", async (req, res) => {
  const name = String(req.body?.name ?? "").trim();
  if (!name) {
    res.status(400).json({ error: "Name is required" });
    return;
  }
  try {
    const item = await prisma.influencer.create({
      data: payload(req.body as Record<string, unknown>, name),
    });
    res.status(201).json(item);
  } catch {
    res.status(409).json({ error: "A profile with that slug already exists" });
  }
});

adminInfluencersRouter.put("/:id", async (req, res) => {
  const name = String(req.body?.name ?? "").trim();
  if (!name) {
    res.status(400).json({ error: "Name is required" });
    return;
  }
  const existing = await prisma.influencer.findUnique({
    where: { id: req.params.id },
  });
  if (!existing) {
    res.status(404).json({ error: "Influencer not found" });
    return;
  }
  try {
    const data = payload(req.body as Record<string, unknown>, name);
    const item = await prisma.influencer.update({
      where: { id: req.params.id },
      data: { ...data, image: data.image || existing.image },
    });
    res.json(item);
  } catch {
    res.status(409).json({ error: "A profile with that slug already exists" });
  }
});

adminInfluencersRouter.delete("/:id", async (req, res) => {
  try {
    await prisma.influencer.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch {
    res.status(404).json({ error: "Influencer not found" });
  }
});

adminInfluencersRouter.patch("/:id/publish", async (req, res) => {
  try {
    const item = await prisma.influencer.update({
      where: { id: req.params.id },
      data: { published: Boolean(req.body?.published) },
    });
    res.json(item);
  } catch {
    res.status(404).json({ error: "Influencer not found" });
  }
});

adminInfluencersRouter.post(
  "/:id/image",
  imageUpload.single("image"),
  async (req, res) => {
    if (!req.file) {
      res.status(400).json({ error: "Image file is required" });
      return;
    }
    try {
      const image = await storeImage(req.file);
      const item = await prisma.influencer.update({
        where: { id: req.params.id },
        data: { image },
      });
      res.json(item);
    } catch {
      res.status(404).json({ error: "Influencer not found" });
    }
  }
);
