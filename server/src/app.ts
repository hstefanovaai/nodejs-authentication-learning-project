import express from "express";
import cors from "cors";

import { env } from "./config/env.js";
import healthRoutes from "./routes/health.routes.js";

export function createApp() {
  const app = express();

  // Parse JSON request bodies into `req.body`.
  app.use(express.json());

  // Allow the React dev server to call this API. `credentials: true` is what
  // later lets the browser send and receive auth cookies cross-origin.
  app.use(
    cors({
      origin: env.clientOrigin,
      credentials: true,
    }),
  );

  app.use("/api/health", healthRoutes);

  return app;
}
