import { Router } from "express";
import jwt from "jsonwebtoken";

import { prisma } from "../lib/prisma";
import {
  adminEmail,
  hashPassword,
  safeEqual,
  verifyPassword,
} from "../lib/password";
import { requireAdmin } from "../middleware/auth";

export const authRouter = Router();

function signAdminToken(email: string) {
  return jwt.sign(
    { role: "admin", email },
    process.env.JWT_SECRET ?? "dev-secret",
    { expiresIn: "7d" }
  );
}

async function passwordMatches(email: string, password: string) {
  const stored = await prisma.adminUser.findUnique({ where: { email } });
  if (stored) return verifyPassword(password, stored.passwordHash);
  const envPassword = String(process.env.ADMIN_PASSWORD ?? "");
  return Boolean(envPassword) && safeEqual(password, envPassword);
}

authRouter.post("/login", async (req, res) => {
  const email = String(req.body?.email ?? "")
    .trim()
    .toLowerCase();
  const password = String(req.body?.password ?? "");
  const allowed = adminEmail();

  if (!allowed || email !== allowed) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const ok = await passwordMatches(email, password);
  if (!ok) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  res.json({ token: signAdminToken(email), email });
});

authRouter.get("/me", requireAdmin, (req, res) => {
  const header = req.headers.authorization ?? "";
  const payload = jwt.decode(header.slice(7)) as { email?: string } | null;
  res.json({ email: payload?.email ?? adminEmail(), role: "admin" });
});

authRouter.post("/password", requireAdmin, async (req, res) => {
  const currentPassword = String(req.body?.currentPassword ?? "");
  const nextPassword = String(req.body?.newPassword ?? "");
  const email = adminEmail();

  if (!email) {
    res.status(500).json({ error: "Admin email is not configured" });
    return;
  }
  if (nextPassword.length < 8) {
    res.status(400).json({ error: "New password must be at least 8 characters" });
    return;
  }
  if (!(await passwordMatches(email, currentPassword))) {
    res.status(401).json({ error: "Current password is wrong" });
    return;
  }

  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash: hashPassword(nextPassword) },
    create: { email, passwordHash: hashPassword(nextPassword) },
  });

  res.json({ ok: true, email });
});
