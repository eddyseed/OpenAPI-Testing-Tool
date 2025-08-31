export interface OpenApiResponse {
  description?: string;
  content?: any; // We can be looser here as we're just passing it to the AI
}
export interface OpenApiRequestBody {
  description?: string;
  content?: any;
  required?: boolean;
}
export interface OpenApiOperation {
  summary?: string;
  description?: string;
  requestBody?: OpenApiRequestBody;
  responses?: Record<string, OpenApiResponse>; // e.g., { "200": {...}, "400": {...} }
  parameters?: any[]; // Optional, can be defined more strictly later
  // We use `... & any` to be explicit that we know this is a subset and other properties are allowed.
  // This is better than a pure `any` as it defines the known structure.
}
export type TestCaseCategory = "valid" | "edge" | "invalid";
export interface TestCase {
  name: string;
  category: TestCaseCategory;
  method: string;
  endpoint: string;
  headers?: Record<string, string> | null;
  body?: any | null;
  expected_response_code: number;
}

export type AiTestResponse = TestCase[];
