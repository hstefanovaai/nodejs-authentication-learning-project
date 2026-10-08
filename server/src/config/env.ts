import "dotenv/config";

/**
 * Read every environment variable in ONE place, validate it here, and export
 * plain typed values. The rest of the app never touches `process.env`.
 */
function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  clientOrigin: required("CLIENT_ORIGIN"),
} as const;

export const isProduction = env.nodeEnv === "production";
