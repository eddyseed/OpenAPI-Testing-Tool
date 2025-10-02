import type { OpenApiData } from "@/types/openapi.type";
import axios from "axios";

export async function generateTestCasesAPI(spec: OpenApiData) {
  console.log("API Spec:", spec, spec.info);
  return axios.post("http://localhost:3000/api/generate-testcases/", spec, {
    headers: { "Content-Type": "application/json" },
  });
}
