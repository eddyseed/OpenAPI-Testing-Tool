import type { OpenApiOperation, TestCase } from "../types/ai.types.js";
import { jsonrepair } from "jsonrepair";
import logger from "../lib/logger.js";
import axios from "axios";
export async function generateTestCasesForEndpoint(
  method: string,
  path: string,
  endpointDefinition: OpenApiOperation
): Promise<TestCase[]> {
  let testCases: TestCase[] = [];

  const roleAndTask = `You are an expert QA automation engineer. Your sole purpose is to generate comprehensive and diverse test cases for REST API endpoints.
Generate 3 test cases for the following API endpoint. Focus on creating distinct scenarios for valid, edge, and invalid inputs.`;
  const rules = `
CRITICAL: You must respond with a valid JSON array of objects, nothing else. Do not include any explanations, markdown, or extra text.
Each test case object in the array MUST have the following exact fields:
- "name": a descriptive string (e.g., "Create user -    valid input")
- "category": a string, must be one of: "valid", "edge", or "invalid"
- "method": the HTTP method as a string (e.g., "${method.toUpperCase()}")
- "endpoint": the API path as a string (e.g., "${path}")
- "headers": an object for HTTP headers (e.g., { "Content-Type": "application/json" }) or null
- "body": an object for the request body or null
- "expected_response_code": an integer for the expected HTTP status code (e.g., 200, 400, 201)
`;

  const dataContext = `
API ENDPOINT DEFINITION:
Method: ${method.toUpperCase()}
Path: ${path}
Summary: ${endpointDefinition.summary || "N/A"}
Description: ${endpointDefinition.description || "N/A"}
Request Body Schema: ${JSON.stringify(
    endpointDefinition.requestBody || {},
    null,
    2
  )}
Responses: ${JSON.stringify(endpointDefinition.responses || {}, null, 2)}
`;
  const command = `
JSON Response:
`;
  const prompt = `${roleAndTask}\n${rules}\n${dataContext}\n${command}`;

  try {
    logger.debug(`Sending prompt to AI for ${method.toUpperCase()} ${path}`);
    const response = await axios.post("http://127.0.0.1:11434/api/generate", {
      model: "gemma2:2b",
      prompt: prompt,
      stream: false,
    });

    let aiResponseText: string = (response.data.response || "").trim();

    if (aiResponseText.startsWith("```")) {
      aiResponseText = aiResponseText
        .replace(/```[a-zA-Z]*\n?/, "") // opening fence
        .replace(/```$/, "") // closing fence
        .trim();
    }

    logger.debug("Raw AI response (cleaned):", aiResponseText);
    try {
      testCases = JSON.parse(aiResponseText);
    } catch (err) {
      logger.warn("Raw JSON invalid, attempting repair...");
      testCases = JSON.parse(jsonrepair(aiResponseText));
    }
    if (!Array.isArray(testCases)) {
      throw new Error("AI response is not a JSON array");
    }
    logger.debug(
      `Successfully generated ${
        testCases.length
      } test cases for ${method.toUpperCase()} ${path}`
    );
  } catch (error) {
    logger.error("AI test generation failed", {
      error: error.message,
      method,
      path,
    });
    console.log(error);
    // Return empty array instead of failing completely
    return [];
  }
  return testCases;
}
