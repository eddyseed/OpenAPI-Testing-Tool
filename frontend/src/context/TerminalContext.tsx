import type { ReactNode } from "react";
import { createContext, useContext, useRef } from "react";
import { Terminal } from "xterm";

type TerminalContextType = {
    logToTerminal: (msg: string) => void;
    registerTerminal: (term: Terminal) => void;
};

const TerminalContext = createContext<TerminalContextType>({
    logToTerminal: () => { },
    registerTerminal: () => { },
});

export const useTerminal = () => useContext(TerminalContext);

export function TerminalProvider({ children }: { children: ReactNode }) {
    const termRef = useRef<Terminal | null>(null);

    const registerTerminal = (term: Terminal) => {
        termRef.current = term;
    };

    const logToTerminal = (msg: string) => {
        termRef.current?.writeln(msg);
    };

    return (
        <TerminalContext.Provider value={{ logToTerminal, registerTerminal }}>
            {children}
        </TerminalContext.Provider>
    );
}
