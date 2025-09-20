import cors from "cors";
import logger from "../lib/logger";
import { SERVER_ENV } from "../config/dotenv";
logger.info(
  `Setting up middleware..\nEnabling CORS for ${SERVER_ENV.CORS_ORIGIN}`
);
const corsOptions = {
  origin: SERVER_ENV.CORS_ORIGIN || "http://localhost:5173",
  methods: ["GET", "POST"],
};
export const corsMiddleware = cors(corsOptions);
