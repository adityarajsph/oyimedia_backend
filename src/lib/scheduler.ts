import { prisma } from "./prisma";

export async function publishDuePosts() {
  const due = await prisma.post.findMany({
    where: {
      published: false,
      scheduledAt: {
        not: null,
        lte: new Date(),
      },
    },
    select: { id: true },
  });

  if (due.length === 0) return 0;

  await prisma.post.updateMany({
    where: { id: { in: due.map((item) => item.id) } },
    data: {
      published: true,
      publishedAt: new Date(),
      scheduledAt: null,
    },
  });

  return due.length;
}

export function startPublishWorker() {
  const tick = () => {
    void publishDuePosts().catch((error) => {
      console.error("Scheduled publish failed", error);
    });
  };
  tick();
  return setInterval(tick, 60_000);
}
