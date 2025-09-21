import type { TerminalContextType } from "@/types/terminalContext.type";
import { createContext } from "react";

export const TerminalContext = createContext<TerminalContextType>({
  logToTerminal: () => {},
  registerTerminal: () => {},
});
