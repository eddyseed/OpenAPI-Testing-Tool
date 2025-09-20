import dotenv from "dotenv";
import path from "path";
import logger from "../lib/logger";

logger.info("Trying to load .env file from the project folder...");
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export const SERVER_ENV = {
  PORT: process.env.PORT || "3001",
  NODE_ENV: process.env.NODE_ENV || "development",
  LOCAL_HOST: process.env.LOCAL_HOST || "http://localhost:3001",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",
};

export const DB_ENV = {
  DATABASE_URL: process.env.DATABASE_URL || "",
};

export const MODEL_ENV = {
  OLLAMA_HOST: process.env.OLLAMA_HOST || "http://localhost:11434",
  MODEL_NAME: process.env.MODEL_NAME || "phi3:mini",
};
