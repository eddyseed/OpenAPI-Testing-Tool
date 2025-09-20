import type { OpenApiData } from "@/types/openapi.type";
import axios from "axios";

export async function generateTestCases(
  spec: OpenApiData,
  logToTerminal: (msg: string) => void
) {
  logToTerminal("🌐 Sending POST request to /api/generate-testcases...");
  try {
    const res = await axios.post("/api/generate-testcases/", spec, {
      headers: { "Content-Type": "application/json" },
    });
    logToTerminal("✅ Test cases generated successfully!");
    return res.data;
  } catch (err: any) {
    logToTerminal("❌ Generating test cases failed: " + err.message);
    throw err;
  }
}
