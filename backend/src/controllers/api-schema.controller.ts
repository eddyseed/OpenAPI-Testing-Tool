import type { Request, Response } from "express";
import logger from "../lib/logger.js";
import { OpenApiSchema } from "../schemas/openapi.schema.js";

// Extending the Express Request type to include 'file' property added by Multer
interface MulterRequest extends Request {
  file?: Express.Multer.File; // Multer adds this
}

export const processApiSchema = async (req: Request, res: Response) => {
  try {
    logger.http("POST /api/schemas/ request received: File upload attempt.");
    // Firstly, we are checking if the file upload status
    if (!req.file) {
      logger.warn("POST /api/schemas/ rejected: No file uploaded.");
      return res.status(400).json({ error: "No file uploaded." });
    }
    logger.info("File uploaded successfully.");

    /*Multer would store the requested file in memory storage it stores all the file's binary data into a Buffer object, it doesn't write the file to the disk
    At this point, the file available in buffer memory is not a string, and it's certainly not a JavaScript object. It's a block of raw bytes (like a long array of numbers from 0-255). */

    let unvalidatedSpec;
    try {
      // Converting Buffer into a string
      const fileContent = req.file.buffer.toString("utf-8");
      // Converting the string into a Javascript Object
      unvalidatedSpec = JSON.parse(fileContent);
      logger.info("File content parsed from JSON to object.");
    } catch (parseError) {
      logger.error("File upload error: Uploaded file is not valid JSON.", {
        error: parseError,
      });
      return res
        .status(400)
        .json({ error: "Uploaded file is not valid JSON." });
    }

    // Process with Zod validation from here...
    logger.info("Validating OpenAPI spec structure with Zod...");
    const validationResult = OpenApiSchema.safeParse(unvalidatedSpec);

    if (!validationResult.success) {
      logger.warn(
        "Validation failed: Provided JSON is not a valid OpenAPI spec.",
        {
          // This formats the Zod error into a readable object
          errors: validationResult.error.flatten(),
        }
      );

      // Send a 400 error response with the validation details
      return res.status(400).json({
        error: "Invalid OpenAPI Schema",
        details: validationResult.error.flatten(), // This is very helpful for debugging
      });
    }
    logger.info("Zod validation passed. Confirmed valid OpenAPI spec.");

    const validOpenApiSpec = validationResult.data;

    res.status(200).json({
      message: "File received and processed!",
      spec: validOpenApiSpec,
    });
  } catch (error) {
    console.error("Error in processApiSchema:", error);
    res
      .status(500)
      .json({ error: "Internal server error during file processing." });
  }
};
