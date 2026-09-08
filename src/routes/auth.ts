import { Router } from "express";
import jwt from "jsonwebtoken";

export const authRouter = Router();

authRouter.post("/login", (req, res) => {
  const email = String(req.body?.email ?? "");
  const password = String(req.body?.password ?? "");

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = jwt.sign(
    { role: "admin", email },
    process.env.JWT_SECRET ?? "dev-secret",
    { expiresIn: "7d" }
  );

  res.json({ token });
});
