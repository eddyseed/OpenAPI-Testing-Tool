import { useRef, type ReactNode } from "react";
import { TerminalContext } from "./TerminalContext";
import type { Terminal } from "xterm";

export function TerminalProvider({ children }: { children: ReactNode }) {
    const termRef = useRef<Terminal | null>(null);

    const registerTerminal = (term: Terminal) => {
        termRef.current = term;
    };

    const logToTerminal = (msg: string) => {
        termRef.current?.writeln(msg);
    };

    return (
        <TerminalContext.Provider value={{ registerTerminal, logToTerminal }}>
            {children}
        </TerminalContext.Provider>
    );
}
