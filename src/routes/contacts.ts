import { Router } from "express";

import { prisma } from "../lib/prisma";

export const contactsRouter = Router();

const NEEDS = new Set(["Campaign", "Retainer", "Collab", "Not sure"]);

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

contactsRouter.post("/", async (req, res) => {
  const name = String(req.body?.name ?? "").trim();
  const email = String(req.body?.email ?? "").trim().toLowerCase();
  const company = String(req.body?.company ?? "").trim();
  const need = String(req.body?.need ?? "Not sure").trim();
  const message = String(req.body?.message ?? "").trim();

  if (name.length < 2 || name.length > 80) {
    res.status(400).json({ error: "Name is required" });
    return;
  }
  if (!isEmail(email) || email.length > 120) {
    res.status(400).json({ error: "A valid email is required" });
    return;
  }
  if (company.length > 120) {
    res.status(400).json({ error: "Company is too long" });
    return;
  }
  if (!NEEDS.has(need)) {
    res.status(400).json({ error: "Choose what you need" });
    return;
  }
  if (message.length < 8 || message.length > 4000) {
    res.status(400).json({ error: "Tell us a little more in the brief" });
    return;
  }

  const item = await prisma.contact.create({
    data: { name, email, company, need, message },
  });

  res.status(201).json({
    id: item.id,
    ok: true,
  });
});
