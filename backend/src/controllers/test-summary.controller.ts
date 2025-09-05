import logger from "../lib/logger.js";
import type { Request, Response } from "express";
import * as yaml from "js-yaml";
import { OpenApiSchema } from "../schemas/openapi.schema.js";
interface MulterRequest extends Request {
  file?: Express.Multer.File; // Multer adds this
}
export const generateTestSummary = async (req: Request, res: Response) => {
  logger.http("POST /api/schemas/ request received: File upload attempt.");
  // Firstly, we are checking if the file upload status
  if (!req.file) {
    logger.warn("POST /api/schemas/ rejected: No file uploaded.");
    return res.status(400).json({ error: "No file uploaded." });
  }
  logger.info(req.file);
  logger.info(
    "File uploaded successfully -> " +
      {
        originalname: req.file.originalname,
      }
  );
  // Determine if the file is JSON or YAML based on mimetype or extension
  const originalName = req.file.originalname.toLowerCase();
  let isYaml = originalName.endsWith(".yaml") || originalName.endsWith(".yml");
  let isJson = originalName.endsWith(".json");

  if (!isYaml && !isJson) {
    logger.warn(
      "Unsupported file type uploaded -> " +
        {
          originalname: req.file.originalname,
        }
    );
    return res.status(400).json({
      error: "Unsupported file type. Please upload a .json or .yaml/.yml file.",
    });
  }
  /*Multer would store the requested file in memory storage it stores all the file's binary data into a Buffer object, it doesn't write the file to the disk
    At this point, the file available in buffer memory is not a string, and it's certainly not a JavaScript object. It's a block of raw bytes (like a long array of numbers from 0-255). */

  let unvalidatedSpec: unknown;
  // Converting Buffer into a string
  const fileContent = req.file.buffer.toString("utf-8");
  try {
    if (isJson) {
      logger.info("Parsing file as JSON.");
      unvalidatedSpec = JSON.parse(fileContent);
    } else {
      // It's YAML
      logger.info("Parsing file as YAML.");
      // The `yaml.load` function converts YAML into a JavaScript object
      unvalidatedSpec = yaml.load(fileContent);
    }
  } catch (parseError) {
    logger.error("File parsing error: Uploaded file is not valid.", {
      error: parseError,
      format: isJson ? "JSON" : "YAML",
    });
    const format = isJson ? "JSON" : "YAML";
    return res
      .status(400)
      .json({ error: `Uploaded file is not valid ${format}.` });
  }
  // Process with Zod validation from here...
  logger.info(
    "File content parsed successfully. Validating structure with Zod..."
  );
  const validationResult = OpenApiSchema.safeParse(unvalidatedSpec);

  if (!validationResult.success) {
    logger.warn(
      "Zod validation failed: Provided file is not a valid OpenAPI spec.",
      {
        errors: validationResult.error.flatten(),
      }
    );
    return res.status(400).json({
      error: "Invalid OpenAPI Schema",
      details: validationResult.error.flatten(),
    });
  }
  logger.info("Zod validation passed. Confirmed valid OpenAPI spec.");
  const validOpenApiSpec = validationResult.data;
  logger.info(`Processing validated spec: ${validOpenApiSpec.info.title}`);

  logger.info(validOpenApiSpec);
  res.status(200).json({
    message: "OpenAPI schema successfully validated and processed!",
    title: validOpenApiSpec.info.title,
    version: validOpenApiSpec.info.version,
    data: validOpenApiSpec,
  });
  ``;
};
