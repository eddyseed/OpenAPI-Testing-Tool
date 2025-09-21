import type { OpenApiData } from "@/types/openapi.type";
import { type ReactNode, useState } from "react";
import { TestRunnerContext } from "./TestRunnerContext";
import { generateTestCases } from "@/lib/test-generator";

export const TestRunnerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [results, setResults] = useState<unknown[]>([]);

    const runTests = async (spec: OpenApiData, logToTerminal: (msg: string) => void) => {
        logToTerminal("🧪 Running tests with provided OpenAPI spec...");
        try {
            const res = await generateTestCases(spec, logToTerminal); // ✅ pass logger
            logToTerminal("✅ Test cases generated successfully!");
            console.log("Test cases generated:", res.testCases);
            setResults(res.testCases);
        } catch (err: unknown) {
            if (err instanceof Error) {
                logToTerminal(`❌ Failed to generate test cases: ${err.message}`);
                console.error(err);
            } else {
                logToTerminal("❌ Failed to generate test cases: Unknown error");
                console.error(err);
            }
        }
    };

    return (
        <TestRunnerContext.Provider value={{ results, runTests }}>
            {children}
        </TestRunnerContext.Provider>
    );
};