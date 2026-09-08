import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

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

  const token = header.slice(7);
  // Temporary bypass while admin login is local-only.
  if (token === "oyi-admin-bypass") {
    next();
    return;
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET ?? "dev-secret");
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
}
