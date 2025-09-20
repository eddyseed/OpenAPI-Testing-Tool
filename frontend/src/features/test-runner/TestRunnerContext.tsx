import { createContext, useState } from "react";
import type { ReactNode } from "react";
import { generateTestCases } from "./api";
import type { OpenApiData } from "@/types/openapi.type";

interface TestRunnerContextType {
    results: unknown[];
    runTests: (spec: OpenApiData, logToTerminal: (msg: string) => void) => Promise<void>;
}

// context/TestRunnerContext.tsx
export const TestRunnerContext = createContext<TestRunnerContextType | null>(null);

export const TestRunnerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [results, setResults] = useState<unknown[]>([]);

    const runTests = async (spec: OpenApiData, logToTerminal: (msg: string) => void) => {
        logToTerminal("🧪 Running tests with provided OpenAPI spec...");
        try {
            const res = await generateTestCases(spec, logToTerminal); // ✅ pass logger
            logToTerminal("✅ Test cases generated successfully!");
            console.log("Test cases generated:", res.testCases);
            setResults(res.testCases);
        } catch (err: any) {
            logToTerminal(`❌ Failed to generate test cases: ${err.message}`);
            console.error(err);
        }
    };

    return (
        <TestRunnerContext.Provider value={{ results, runTests }}>
            {children}
        </TestRunnerContext.Provider>
    );
};
