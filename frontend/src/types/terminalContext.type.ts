import type { Terminal } from "xterm";

export type TerminalContextType = {
  logToTerminal: (msg: string) => void;
  registerTerminal: (term: Terminal) => void;
};
