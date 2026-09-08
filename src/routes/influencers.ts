import { Router } from "express";

import { prisma } from "../lib/prisma";

export const influencersRouter = Router();

influencersRouter.get("/", async (req, res) => {
  const region = String(req.query.region ?? "");
  const posts = await prisma.influencer.findMany({
    where: {
      published: true,
      ...(region ? { region } : {}),
    },
    orderBy: { updatedAt: "desc" },
  });
  res.json(posts);
});
