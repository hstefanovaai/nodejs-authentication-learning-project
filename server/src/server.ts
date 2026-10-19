import { exec } from "node:child_process";
import { promisify } from "node:util";

import { sequelize } from "./config/database.js";
import { createApp } from "./app.js";
import { env } from "./config/env.js";

const execAsync = promisify(exec);

/**
 * Apply any pending database migrations via the Sequelize CLI.
 * Replaces `sequelize.sync()`: migrations are the single source of truth for
 * the schema and, unlike sync(), they reliably alter existing tables.
 */
async function runMigrations() {
  const { stdout, stderr } = await execAsync("npx sequelize-cli db:migrate");
  if (stdout.trim()) console.log(stdout.trim());
  if (stderr.trim()) console.error(stderr.trim());
}

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("MySQL connected successfully.");

    await runMigrations();

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
