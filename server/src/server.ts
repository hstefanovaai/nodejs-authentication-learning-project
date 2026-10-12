import { sequelize } from "./config/database.js";
import { createApp } from "./app.js";
import { env } from "./config/env.js";

// const app = createApp();
const PORT = Number(process.env.PORT) || 4000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("MySQL connected successfully.");

    // Development only: creates tables that do not exist.
    // Use migrations to manage schema changes in production.
    await sequelize.sync();

    const app = createApp();

    app.listen(env.port, () => {
      console.log(`API running at http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
