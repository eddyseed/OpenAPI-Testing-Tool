import { useContext } from "react";
import { FileContext } from "@/context/fileContext";
import type { FileContextType } from "@/types/fileContext.type";

export const useFile = (): FileContextType => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error("useFile must be used within a FileProvider");
  }
  return context;
};
