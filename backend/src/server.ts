import http from "http";
import express from "express";
import logger from "./lib/logger.js";
import genSummaryRoute from "./routes/gen-summary.route.js";
import genTestcasesRoute from "./routes/gen-testcases.route.js";
import { setUpWebSocket } from "./websocket/socket.config.js";
import { corsMiddleware } from "./middlewares/cors.middleware.js";
import { SERVER_ENV } from "./config/dotenv.js";

logger.info("Starting the Express server...");
const app = express();

app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount routes
app.use("/api/upload-schema", genSummaryRoute);
app.use("/api/generate-testcases", genTestcasesRoute);

// Configure websockets
const port = SERVER_ENV.PORT;
const server = http.createServer(app);
setUpWebSocket(server);

logger.info("Starting the server...");
server.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});

export { app, server };
