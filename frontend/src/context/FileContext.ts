import type { FileContextType } from "@/types/fileContext.type";
import { createContext } from "react";

export const FileContext = createContext<FileContextType | undefined>(
  undefined
);
