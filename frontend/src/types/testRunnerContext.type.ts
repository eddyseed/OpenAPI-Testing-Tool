import type { OpenApiData } from "./openapi.type";

export interface TestRunnerContextType {
  results: unknown[];
  runTests: (
    spec: OpenApiData,
    logToTerminal: (msg: string) => void
  ) => Promise<void>;
}
