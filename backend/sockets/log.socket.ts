import { Server, Socket } from "socket.io";
import { spawn } from "child_process";
import logger from "../src/lib/logger.js";

export const setupLogSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    logger.info("Client connected:", socket.id);

    socket.on("startLogs", (command: string) => {
      console.log("Starting logs for command:", command);
      socket.on("fileUploadStarted", (fileName: string) => {
        socket.emit("log", `Upload started for file: ${fileName}`);
      });
      socket.on("confirmUpload", (fileName: string) => {
        socket.emit("log", `File uploaded successfully: ${fileName}`);
      });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};
