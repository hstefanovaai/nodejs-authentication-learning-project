import express from "express";
import cors from "cors";

import { env } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";

import session from "express-session";
import MySQLStore from "express-mysql-session";

export function createApp() {
  const app = express();

  const MySQLStoreSession = MySQLStore(session);

  const sessionStore = new MySQLStoreSession({
    host: "localhost",
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  // Allow the React dev server to call this API. `credentials: true` is what
  // later lets the browser send and receive auth cookies cross-origin.
  app.use(
    cors({
      origin: process.env.CLIENT_URL,
      credentials: true,
    }),
  );

  // Parse JSON request bodies into `req.body`.
  app.use(express.json());

  app.use(
    session({
      name: "app.sid",
      secret: process.env.SESSION_SECRET!,
      store: sessionStore,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      },
    }),
  );
  app.use("/api/auth", authRoutes);

  return app;
}
