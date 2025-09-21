import { createContext } from "react";
import type { LoadingContextType } from "@/types/loadingContext.type";

// Context definition only — Fast Refresh won't complain
export const LoadingContext = createContext<LoadingContextType | undefined>(
  undefined
);
