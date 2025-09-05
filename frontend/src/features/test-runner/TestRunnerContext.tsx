import { createContext, useState } from "react";
import type { ReactNode } from "react";
import { generateTestCases } from "./api";

interface OpenApiData {
    openapi: string;
    info: {
        title: string;
        version: string;
    };
    paths: Record<string, any>;
    components?: Record<string, any>;
}

interface TestRunnerContextType {
    results: unknown[];
    runTests: (spec: OpenApiData) => Promise<void>;
}

// context/TestRunnerContext.tsx
export const TestRunnerContext = createContext<TestRunnerContextType | null>(null);

export const TestRunnerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [results, setResults] = useState<unknown[]>([]);

    const runTests = async (spec: OpenApiData) => {
        console.log("Running tests with spec:", spec);
        const res = await generateTestCases(spec);
        console.log("Test cases generated:", res.testCases);
        setResults(res.testCases);
    };

    return (
        <TestRunnerContext.Provider value={{ results, runTests }}>
            {children}
        </TestRunnerContext.Provider>
    );
};
