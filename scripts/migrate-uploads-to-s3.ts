import fs from "node:fs/promises";
import path from "node:path";

import "../src/env";
import { prisma } from "../src/lib/prisma";
import { putImage, s3Enabled } from "../src/lib/s3";

async function migrate() {
  if (!s3Enabled()) {
    throw new Error("Set S3_BUCKET (and AWS_REGION) before migrating");
  }

  const dir = path.join(process.cwd(), "uploads");
  const files = await fs.readdir(dir);
  const urls = new Map<string, string>();

  for (const name of files) {
    if (name.startsWith(".")) continue;
    const body = await fs.readFile(path.join(dir, name));
    const ext = path.extname(name).toLowerCase();
    const type =
      ext === ".png"
        ? "image/png"
        : ext === ".webp"
          ? "image/webp"
          : ext === ".gif"
            ? "image/gif"
            : "image/jpeg";
    const url = await putImage(`uploads/${name}`, body, type);
    urls.set(`/uploads/${name}`, url);
    console.log(name, "->", url);
  }

  for (const [oldPath, url] of urls) {
    await prisma.influencer.updateMany({
      where: { image: oldPath },
      data: { image: url },
    });
    await prisma.post.updateMany({
      where: { coverImage: oldPath },
      data: { coverImage: url },
    });
    await prisma.service.updateMany({
      where: { image: oldPath },
      data: { image: url },
    });
  }

  await prisma.$disconnect();
  console.log(`Moved ${urls.size} files to S3`);
}

migrate().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
