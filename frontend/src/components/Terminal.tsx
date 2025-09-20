import { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import "xterm/css/xterm.css"
import { useWebSocket } from "../hooks/useWebSocket";

export default function TerminalView() {
    const terminalRef = useRef<HTMLDivElement | null>(null);
    const xtermRef = useRef<Terminal | null>(null);
    const { messages, sendMessage, isConnected } = useWebSocket("ws://localhost:3001");

    useEffect(() => {
        // Initialize Xterm only once
        if (terminalRef.current && !xtermRef.current) {
            const term = new Terminal({
                cols: 80,
                rows: 24,
                theme: { background: "#1e1e1e", foreground: "#ffffff" },
                cursorBlink: true,
            });
            term.open(terminalRef.current);
            term.writeln("🟢 Terminal initialized...");
            xtermRef.current = term;

            // Handle user input
            term.onData((data) => {
                sendMessage(data); // Send typed data to WebSocket
            });
        }

        return () => {
            xtermRef.current?.dispose();
        };
    }, [sendMessage]);

    // When new WebSocket messages arrive, print them to the terminal
    useEffect(() => {
        if (xtermRef.current && messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            xtermRef.current.writeln(lastMessage);
        }
    }, [messages]);

    return (
        <div className="p-4">
            <p>Status: {isConnected ? "🟢 Connected" : "🔴 Disconnected"}</p>
            <div
                ref={terminalRef}
                style={{
                    width: "100%",
                    height: "400px",
                    backgroundColor: "#1e1e1e",
                    borderRadius: "8px",
                }}
            ></div>
        </div>
    );
}
