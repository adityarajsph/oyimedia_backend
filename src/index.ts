import "./env";
import cors from "cors";
import express from "express";
import path from "node:path";

import { prisma } from "./lib/prisma";
import { adminContactsRouter } from "./routes/admin-contacts";
import { adminInfluencersRouter } from "./routes/admin-influencers";
import { adminPostsRouter } from "./routes/admin-posts";
import { adminServicesRouter } from "./routes/admin-services";
import { authRouter } from "./routes/auth";
import { contactsRouter } from "./routes/contacts";
import { influencersRouter } from "./routes/influencers";
import { postsRouter } from "./routes/posts";
import { servicesRouter } from "./routes/services";

const app = express();
const port = Number(process.env.PORT ?? 4000);
const host = process.env.HOST ?? "0.0.0.0";

app.use(
  cors({
    origin: (process.env.FRONTEND_ORIGIN ??
      "http://localhost:3000,http://localhost:5173,https://oyimedia.com,https://www.oyimedia.com")
      .split(",")
      .map((origin) => origin.trim()),
  })
);
app.use(express.json({ limit: "2mb" }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (_req, res) => {
  res.json({ message: "OyiMedia API is running" });
});

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "oyi-media-backend" });
});

app.use("/api/posts", postsRouter);
app.use("/api/influencers", influencersRouter);
app.use("/api/contact", contactsRouter);
app.use("/api/services", servicesRouter);
app.use("/api/admin", authRouter);
app.use("/api/admin/posts", adminPostsRouter);
app.use("/api/admin/influencers", adminInfluencersRouter);
app.use("/api/admin/contacts", adminContactsRouter);
app.use("/api/admin/services", adminServicesRouter);

const server = app.listen(port, host, () => {
  console.log(`OYI Media API running on http://${host}:${port}`);
});

async function shutdown() {
  server.close();
  await prisma.$disconnect();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
