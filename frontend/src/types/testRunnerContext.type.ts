import type { OpenApiData } from "./openapi.type";
import type { TestCase } from "./testCases.type";

export interface TestRunnerContextType {
  results: TestCase[];
  runTests: (
    spec: OpenApiData,
    logToTerminal: (msg: string) => void
  ) => Promise<void>;
}
