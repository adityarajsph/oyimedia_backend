import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { adminEmail } from "../lib/password";

export type AdminToken = {
  role: "admin";
  email: string;
};

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const payload = jwt.verify(
      header.slice(7),
      process.env.JWT_SECRET ?? "dev-secret"
    ) as Partial<AdminToken>;
    const email = String(payload.email ?? "")
      .trim()
      .toLowerCase();
    if (payload.role !== "admin" || !email || email !== adminEmail()) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
}
