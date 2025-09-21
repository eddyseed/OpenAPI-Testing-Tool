import { useContext } from "react";
import { TestRunnerContext } from "@/context/TestRunnerContext";
import type { TestRunnerContextType } from "@/types/testRunnerContext.type";

export function useTestRunner(): TestRunnerContextType {
  const ctx = useContext(TestRunnerContext);
  if (!ctx)
    throw new Error("useTestRunner must be used within TestRunnerProvider");
  return ctx;
}
