import type { Request, Response } from "express";
import logger from "../lib/logger.js";
import { type OpenApiSpec } from "../schemas/openapi.schema.js";
import { generateTestCasesForEndpoint } from "../services/ai-test-generator.service.js";

// Extending the Express Request type to include 'file' property added by Multer
interface MulterRequest extends Request {
  file?: Express.Multer.File; // Multer adds this
}

export const processApiSchema = async (
  validOpenApiSpec: OpenApiSpec,
  res: Response
) => {
  try {
    //Generating Testcases
    const allGeneratedTestCases: any[] = [];

    try {
      // Iterate through all endpoints in the OpenAPI spec
      for (const [path, pathItem] of Object.entries(validOpenApiSpec.paths)) {
        for (const [method, operation] of Object.entries(pathItem as any)) {
          // Skip non-HTTP methods
          if (!["get", "post", "put", "delete", "patch"].includes(method)) {
            continue;
          }

          logger.info(`Generating tests for ${method.toUpperCase()} ${path}`);

          // Generate test cases for this endpoint using axios
          const testCases = await generateTestCasesForEndpoint(
            method,
            path,
            operation
          );

          allGeneratedTestCases.push(...testCases);
        }
      }

      logger.info(
        `Total test cases generated: ${allGeneratedTestCases.length}`
      );
    } catch (error) {
      logger.error("Error during AI test generation", { error: error.message });
      // Don't fail the entire request if AI generation fails
    }

    res.status(200).json({
      message: "Test cases were generated successfully!",
      totalTestCases: allGeneratedTestCases.length,
      testCases: allGeneratedTestCases,
    });
  } catch (error) {
    logger.error(
      "Unexpected internal server error during schema processing:",
      error
    );
    res
      .status(500)
      .json({ error: "Internal server error during schema processing." });
  }
};
