import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import genSummaryRoute from "./routes/gen-summary.route.js";
import genTestcasesRoute from "./routes/gen-testcases.route.js";
import { setupLogSocket } from "../sockets/log.socket.js";
dotenv.config();

// Express app configurations
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  })
);
setupLogSocket(io);
app.use(express.json());
app.get("/", (_, res) => {
  res.send("The app is working fine!");
});

// Mounting the apiSchema routes
app.use("/api/upload-schema", genSummaryRoute);
app.use("/api/generate-testcases", genTestcasesRoute);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}/`);
});
