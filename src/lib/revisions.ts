import type { Post } from "@prisma/client";

import { prisma } from "./prisma";

const KEEP = 30;

export function snapshotFromPost(post: Post) {
  const {
    id: _id,
    createdAt: _created,
    updatedAt: _updated,
    ...rest
  } = post;
  return JSON.stringify(rest);
}

const DATE_KEYS = ["scheduledAt", "publishedAt"] as const;

export function parseSnapshot(snapshot: string) {
  const data = JSON.parse(snapshot) as Record<string, unknown>;
  for (const key of DATE_KEYS) {
    if (typeof data[key] === "string") {
      const date = new Date(data[key]);
      data[key] = Number.isNaN(date.getTime()) ? null : date;
    }
  }
  return data;
}

export async function saveRevision(post: Post) {
  await prisma.postRevision.create({
    data: {
      postId: post.id,
      snapshot: snapshotFromPost(post),
    },
  });

  const extras = await prisma.postRevision.findMany({
    where: { postId: post.id },
    orderBy: { createdAt: "desc" },
    skip: KEEP,
    select: { id: true },
  });
  if (extras.length) {
    await prisma.postRevision.deleteMany({
      where: { id: { in: extras.map((item) => item.id) } },
    });
  }
}
