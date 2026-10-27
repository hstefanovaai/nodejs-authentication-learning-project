import express, { NextFunction, Request, Response } from "express";
import { errorHandler } from "./middleware/error-hander.js";
import { env } from "./config/env.js";

import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/products.routes.js";
import userRoutes from "./routes/user.routes.js";
import {
  doubleCsrfProtection,
  invalidCsrfTokenError,
} from "./middleware/csrf.js";

import session from "express-session"; // init session middleware
import MySQLStore from "express-mysql-session"; // store session in DB

export function createApp() {
  const app = express();

  // Allow the React dev server to call this API. `credentials: true` is what
  // later lets the browser send and receive auth cookies cross-origin.
  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN,
      credentials: true,
    }),
  );

  // Parse JSON request bodies into `req.body`.
  app.use(express.json());

  const MySQLStoreSession = MySQLStore(session); // connection to DB to store the session

  const sessionStore = new MySQLStoreSession({
    host: "localhost",
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  // Browser sends a cookie with every request. Cookie is stored on the frontend, session is stored on the backend (database store, not Redis).
  // A client needs to tell the server to which session he belongs because the session in the end will be an entry that is stored in the DB.
  // we use a cookie where we store the hashed ID of the session.
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

  // csrf-csrf reads the CSRF cookie from `req.cookies`, so cookie-parser must
  // run after the session middleware and before the CSRF protection.
  app.use(cookieParser());

  // Reject any state-changing request (POST/PUT/PATCH/DELETE) that is missing
  // a valid CSRF token. GET/HEAD/OPTIONS are ignored, so reads and the
  // GET /api/auth/csrf-token route stay reachable without a token.
  app.use(doubleCsrfProtection);

  app.use("/api/auth", authRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/users", userRoutes);

  // Turn CSRF failures into a consistent JSON 403 instead of the default
  // HTML error page.
  app.use((err: unknown, _req: Request, res: Response, next: NextFunction) => {
    if (err === invalidCsrfTokenError) {
      return res.status(403).json({ message: "Invalid CSRF token." });
    }
    next(err);
  });

  app.use(errorHandler);
  return app;
}
