import { useContext } from "react";
import { LoadingContext } from "@/context/LoadingContext";
import type { LoadingContextType } from "@/types/loadingContext.type";

export function useLoading(): LoadingContextType {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}
