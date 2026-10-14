import express from "express";
import cors from "cors";

import { env } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/products.routes.js"

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

  // Browser sends a cookie with every request. Cookie is stored on the frontend, session is stored on the backend.
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
  app.use("/api/auth", authRoutes);
  app.use("/api/products", productRoutes)

  return app;
}
