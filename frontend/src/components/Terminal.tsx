import { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { io } from "socket.io-client";
import 'xterm/css/xterm.css';

const TerminalComponent: React.FC = () => { 
    const terminalRef = useRef<HTMLDivElement>(null);
    const term = useRef<Terminal>();

    useEffect(() => {
        if (!terminalRef.current) return;

        // Initialize terminal
        term.current = new Terminal({ convertEol: true, cols: 80, rows: 20 });
        term.current.open(terminalRef.current);

        // Connect to backend socket
        const socket = io('http://localhost:3001'); // replace with your backend URL

        socket.on('log', (data: string) => {
            term.current?.writeln(data);
        });

        return () => {
            socket.disconnect();
            term.current?.dispose();
        };
    }, []);
    return <div ref={terminalRef} style={{ width: '100%', height: '200px', background: 'black' }} />
}
export default TerminalComponent;