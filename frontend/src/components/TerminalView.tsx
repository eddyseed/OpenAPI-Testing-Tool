import { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import "xterm/css/xterm.css";
import { useWebSocket } from "../hooks/useWebSocket";
import { useTerminal } from "@/hooks/useTerminal";
import { COLORS } from "@/config/appConfig";

export default function TerminalView() {
    const terminalRef = useRef<HTMLDivElement | null>(null);
    const xtermRef = useRef<Terminal | null>(null);
    const { registerTerminal } = useTerminal();

    // Use your custom WebSocket hook
    const { messages, isConnected, error } = useWebSocket("ws://localhost:3000");

    useEffect(() => {
        if (!terminalRef.current) return;

        const term = new Terminal({
            cursorBlink: true,
            fontFamily: "'Fira Code', monospace",
            fontSize: 14,
            theme: {
                background: COLORS.primary,   // dark background
                foreground: COLORS.text,   // neon cyan text
                cursor: "#00ffff",       // neon cursor 
            }
        });

        term.open(terminalRef.current);
        xtermRef.current = term;

        // Register terminal in context so logToTerminal works
        registerTerminal(term);

        return () => {
            term.dispose();
        };
    }, [registerTerminal]);

    // Print incoming WebSocket messages
    useEffect(() => {
        if (!xtermRef.current) return;

        if (error) {
            xtermRef.current.writeln(`Connection failed: ${error.message}`);
        } else if (isConnected) {
            xtermRef.current.writeln("Connected to backend!");
        }
        // Print the last message from the server
        if (messages.length > 0) {
            const lastMsg = messages[messages.length - 1];
            xtermRef.current.writeln(lastMsg);
        }
    }, [messages, isConnected, error]);

    return (
        <div className="px-4 py-2"
            ref={terminalRef}
            style={{
                width: "100%",
                height: "300px",
                backgroundColor: COLORS.background,
                overflow: "hidden",
            }}
        />
    );
}
