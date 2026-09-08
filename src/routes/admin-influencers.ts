import { Router } from "express";
import multer from "multer";
import path from "node:path";

import { prisma } from "../lib/prisma";
import { slugify } from "../lib/slugify";
import { requireAdmin } from "../middleware/auth";

export const adminInfluencersRouter = Router();

const upload = multer({
  dest: path.join(process.cwd(), "uploads"),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image uploads are allowed"));
      return;
    }
    cb(null, true);
  },
});

adminInfluencersRouter.use(requireAdmin);

function payload(body: Record<string, unknown>, name: string) {
  const region =
    String(body.region ?? "india") === "international"
      ? "international"
      : "india";
  return {
    name,
    slug: slugify(String(body.slug ?? name)),
    bio: String(body.bio ?? ""),
    category: String(body.category ?? ""),
    region,
    location: String(body.location ?? ""),
    followers: String(body.followers ?? ""),
    platform: String(body.platform ?? "Instagram"),
    image: String(body.image ?? ""),
    rating: String(body.rating ?? "5.0"),
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
  try {
    const item = await prisma.influencer.update({
      where: { id: req.params.id },
      data: payload(req.body as Record<string, unknown>, name),
    });
    res.json(item);
  } catch {
    res.status(404).json({ error: "Influencer not found" });
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
  upload.single("image"),
  async (req, res) => {
    if (!req.file) {
      res.status(400).json({ error: "Image file is required" });
      return;
    }
    try {
      const item = await prisma.influencer.update({
        where: { id: req.params.id },
        data: { image: `/uploads/${req.file.filename}` },
      });
      res.json(item);
    } catch {
      res.status(404).json({ error: "Influencer not found" });
    }
  }
);
