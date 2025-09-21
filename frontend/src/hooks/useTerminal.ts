import { useContext } from "react";
import { TerminalContext } from "@/context/TerminalContext";
import type { TerminalContextType } from "@/types/terminalContext.type";

export function useTerminal(): TerminalContextType {
  const context = useContext(TerminalContext);
  if (!context) {
    throw new Error("useTerminal must be used within a TerminalProvider");
  }
  return context;
}
