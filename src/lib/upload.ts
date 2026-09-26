import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import multer from "multer";

import { putImage, s3Enabled } from "./s3";

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);
const VIDEO_EXTS = new Set([".mp4", ".webm", ".mov"]);
const VIDEO_MAX_BYTES = 80 * 1024 * 1024;

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

export const videoUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: VIDEO_MAX_BYTES },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("video/")) {
      cb(new Error("Only video uploads are allowed"));
      return;
    }
    cb(null, true);
  },
});

function fileName(originalName: string, allowed: Set<string>, fallback: string) {
  const ext = path.extname(originalName).toLowerCase();
  const safe = allowed.has(ext) ? ext : fallback;
  return `${crypto.randomBytes(16).toString("hex")}${safe}`;
}

async function storeFile(
  file: Express.Multer.File,
  name: string,
  fallbackType: string
) {
  const key = `uploads/${name}`;

  if (s3Enabled()) {
    return putImage(key, file.buffer, file.mimetype || fallbackType);
  }

  const dir = path.join(process.cwd(), "uploads");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), file.buffer);
  return `/uploads/${name}`;
}

export async function storeImage(file: Express.Multer.File) {
  return storeFile(
    file,
    fileName(file.originalname, IMAGE_EXTS, ".jpg"),
    "image/jpeg"
  );
}

export async function storeVideo(file: Express.Multer.File) {
  return storeFile(
    file,
    fileName(file.originalname, VIDEO_EXTS, ".mp4"),
    "video/mp4"
  );
}
