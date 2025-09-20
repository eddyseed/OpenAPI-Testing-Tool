import { WebSocket } from "ws";
import logger from "../lib/logger.js";

interface IncomingPayload {
  type: string;
  data?: unknown;
}

export const handleMessage = (ws: WebSocket, raw: string) => {
  let payload: IncomingPayload;

  try {
    payload = JSON.parse(raw);
  } catch {
    logger.error("Invalid JSON received");
    ws.send(JSON.stringify({ type: "error", data: "Invalid JSON" }));
    return;
  }

  switch (payload.type) {
    case "api:request":
      logger.info(`Received API request: ${JSON.stringify(payload.data)}`);
      ws.send(
        JSON.stringify({ type: "api:response", data: "Request processed!" })
      );
      break;

    case "api:cancel":
      logger.info(
        `Received API cancel request: ${JSON.stringify(payload.data)}`
      );
      ws.send(
        JSON.stringify({ type: "api:status", data: "Request cancelled" })
      );
      break;

    default:
      logger.warn(`Unknown event type: ${payload.type}`);
      ws.send(JSON.stringify({ type: "error", data: "Unknown event type" }));
  }
};
