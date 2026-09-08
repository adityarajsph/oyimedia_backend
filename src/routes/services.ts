import { Router } from "express";

import { prisma } from "../lib/prisma";

export const servicesRouter = Router();

function audienceWhere(value: unknown) {
  const audience = String(value ?? "");
  if (audience === "brand" || audience === "creators") return { audience };
  return {};
}

servicesRouter.get("/", async (req, res) => {
  const items = await prisma.service.findMany({
    where: {
      published: true,
      ...audienceWhere(req.query.audience),
    },
    orderBy: [{ audience: "asc" }, { sortOrder: "asc" }, { title: "asc" }],
  });
  res.json(items);
});

servicesRouter.get("/:audience/:slug", async (req, res) => {
  const audience = String(req.params.audience ?? "");
  if (audience !== "brand" && audience !== "creators") {
    res.status(404).json({ error: "Service not found" });
    return;
  }
  const item = await prisma.service.findUnique({
    where: {
      audience_slug: {
        audience,
        slug: String(req.params.slug ?? ""),
      },
    },
  });
  if (!item || !item.published) {
    res.status(404).json({ error: "Service not found" });
    return;
  }
  res.json(item);
});
