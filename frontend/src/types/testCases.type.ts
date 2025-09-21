export interface TestCase {
  name: string;
  category: string;
  method: string;
  endpoint: string;
  headers: Record<string, unknown>; // or any object type
  body?: unknown; // or more specific type
  expected_response_code: number;
}
