import { createContext } from "react";
import type { TestRunnerContextType } from "@/types/testRunnerContext.type";

export const TestRunnerContext = createContext<
  TestRunnerContextType | undefined
>(undefined);
