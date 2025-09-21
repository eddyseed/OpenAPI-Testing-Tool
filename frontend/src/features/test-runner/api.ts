import { apiClient } from "@/lib/api-client";
import type { OpenApiData } from "@/types/openapi.type";

export async function generateTestCasesAPI(spec: OpenApiData) {
  return apiClient.post("/generate-testcases/", spec, {
    headers: { "Content-Type": "application/json" },
  });
}
