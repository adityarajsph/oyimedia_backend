import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import multer from "multer";

import { putImage, s3Enabled } from "./s3";

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

export const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image uploads are allowed"));
      return;
    }
    cb(null, true);
  },
});

function fileName(originalName: string) {
  const ext = path.extname(originalName).toLowerCase();
  const safe = IMAGE_EXTS.has(ext) ? ext : ".jpg";
  return `${crypto.randomBytes(16).toString("hex")}${safe}`;
}

export async function storeImage(file: Express.Multer.File) {
  const name = fileName(file.originalname);
  const key = `uploads/${name}`;

  if (s3Enabled()) {
    return putImage(key, file.buffer, file.mimetype || "image/jpeg");
  }

  const dir = path.join(process.cwd(), "uploads");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), file.buffer);
  return `/uploads/${name}`;
}
