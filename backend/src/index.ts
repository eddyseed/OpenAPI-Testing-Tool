import express from "express";
import dotenv from "dotenv";
import apiSchemaRoutes from "./routes/api-schema.routes.js";
dotenv.config();

// Express app configurations
const app = express();
const port = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.send("The app is working fine!");
});

// Mounting the apiSchema routes
app.use("/api/upload-schema", apiSchemaRoutes);
app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}/`);
});
