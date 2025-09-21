import { Server as HTTPServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import logger from "../lib/logger.js";
import { handleMessage } from "./socket.handlers.js";

export const setUpWebSocket = (server: HTTPServer) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws: WebSocket) => {
    logger.info("Client has connected!");
    ws.send("Connection to the backend successful!");

    // Listen for *all* incoming messages
    ws.on("message", (raw: string) => handleMessage(ws, raw));

    ws.on("close", () => {
      logger.info("Client has disconnected!");
    });

    ws.on("error", (err) => {
      logger.error(`WebSocket error: ${err}`);
    });
  });
};
