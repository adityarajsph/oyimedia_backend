import { Router } from "express";

import { prisma } from "../lib/prisma";
import { requireAdmin } from "../middleware/auth";

export const adminContactsRouter = Router();

adminContactsRouter.use(requireAdmin);

adminContactsRouter.get("/", async (_req, res) => {
  const items = await prisma.contact.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json(items);
});

adminContactsRouter.get("/:id", async (req, res) => {
  const item = await prisma.contact.findUnique({
    where: { id: req.params.id },
  });
  if (!item) {
    res.status(404).json({ error: "Contact not found" });
    return;
  }
  res.json(item);
});

adminContactsRouter.patch("/:id/read", async (req, res) => {
  try {
    const item = await prisma.contact.update({
      where: { id: req.params.id },
      data: { read: Boolean(req.body?.read) },
    });
    res.json(item);
  } catch {
    res.status(404).json({ error: "Contact not found" });
  }
});

adminContactsRouter.delete("/:id", async (req, res) => {
  try {
    await prisma.contact.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch {
    res.status(404).json({ error: "Contact not found" });
  }
});
