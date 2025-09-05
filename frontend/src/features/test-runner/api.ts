import axios from "axios";
interface OpenApiData {
  openapi: string;
  info: {
    title: string;
    version: string;
  };
  paths: Record<string, any>;
  components?: Record<string, any>;
}
export async function generateTestCases(spec: OpenApiData) {
  console.log(
    "Sending POST request to /api/generate-testcases/ with spec -> :",
    spec
  );
  const res = await axios.post("/api/generate-testcases/", spec, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
}
