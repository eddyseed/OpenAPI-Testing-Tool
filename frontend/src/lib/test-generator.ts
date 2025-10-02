import axios from "axios";
import type { OpenApiData } from "@/types/openapi.type";
import { generateTestCasesAPI } from "@/features/test-runner/api";

export async function generateTestCases(
  spec: OpenApiData,
  logToTerminal: (msg: string) => void
) {
  logToTerminal("Sending POST request to /api/generate-testcases...");
  try {
    const res = await generateTestCasesAPI(spec);
    console.log(res, res.data);
    logToTerminal("Test cases generated successfully!");
    return res.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      logToTerminal("Generating test cases failed: " + err.message);
      throw err;
    } else if (err instanceof Error) {
      logToTerminal("Generating test cases failed: " + err.message);
      throw err;
    } else {
      logToTerminal("Generating test cases failed: Unknown error");
      throw new Error("Unknown error");
    }
  }
}
