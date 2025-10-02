import dotenv from "dotenv";
import path from "path";
import logger from "../lib/logger";

// Load .env from project root
logger.info("Trying to load .env file from the project folder...");
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// Helper to clean quotes & force IPv4 if needed
function cleanEnvVar(
  val: string | undefined,
  fallback?: string
): string | undefined {
  if (!val) return fallback;
  return val.replace(/^"|"$/g, "").replace("localhost", "127.0.0.1");
}

export const SERVER_ENV = {
  PORT: process.env.PORT || "3000",
  NODE_ENV: process.env.NODE_ENV || "development",
  LOCAL_HOST: process.env.LOCAL_HOST || "http://127.0.0.1",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
};

export const MODEL_ENV = {
  OLLAMA_HOST: cleanEnvVar(process.env.OLLAMA_HOST, "http://127.0.0.1:11434"),
  MODEL_NAME: cleanEnvVar(process.env.MODEL_NAME, "phi3"),
};
