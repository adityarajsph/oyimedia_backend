import { Router } from "express";

import { prisma } from "../lib/prisma";
import { imageUpload, storeImage } from "../lib/upload";
import { requireAdmin } from "../middleware/auth";

export const adminMediaRouter = Router();

adminMediaRouter.use(requireAdmin);

adminMediaRouter.get("/", async (_req, res) => {
  const items = await prisma.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
    take: 60,
  });
  res.json(items);
});

adminMediaRouter.post("/", imageUpload.single("image"), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "Image file is required" });
    return;
  }

  const url = await storeImage(req.file);
  const item = await prisma.mediaAsset.create({
    data: {
      url,
      alt: String(req.body?.alt ?? "").trim(),
      title: String(req.body?.title ?? "").trim(),
      caption: String(req.body?.caption ?? "").trim(),
      description: String(req.body?.description ?? "").trim(),
    },
  });
  res.status(201).json(item);
});
