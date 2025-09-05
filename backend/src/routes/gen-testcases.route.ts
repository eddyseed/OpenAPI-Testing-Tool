import express from "express";
import { processApiSchema } from "../controllers/api-schema.controller.js";
import { OpenApiSchema } from "../schemas/openapi.schema.js";
import logger from "../lib/logger.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    logger.info("Backend Recieved your request");
    // Validate incoming spec with Zod
    console.log(req.body);
    const validSpec = OpenApiSchema.parse(req.body);
    console.log("Received valid OpenAPI spec:", validSpec);
    // Call your processor
    await processApiSchema(validSpec, res);
  } catch (error: any) {
    res.status(400).json({
      error: error.message || "Invalid OpenAPI spec",
    });
  }
});

export default router;
