// src/services/TerminalManager.ts
import { Terminal } from "xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "@xterm/addon-web-links";
import "xterm/css/xterm.css";

export interface LogMessage {
  type: "info" | "error" | "success" | "warning";
  message: string;
  timestamp?: Date;
  category?: string;
}

export class TerminalManager {
  private terminal: Terminal;
  private fitAddon: FitAddon;
  private container: HTMLElement;
  private websocket: WebSocket | null = null;

  constructor(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }
    this.container = container;

    // Initialize terminal with configuration
    this.terminal = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'JetBrains Mono, Consolas, "Courier New", monospace',
      theme: {
        background: "#0d1117",
        foreground: "#c9d1d9",
        cursor: "#f0f6fc",
        selection: "#264f78",
        black: "#484f58",
        red: "#ff7b72",
        green: "#7ce38b",
        yellow: "#ffa657",
        blue: "#79c0ff",
        magenta: "#d2a8ff",
        cyan: "#a5f3fc",
        white: "#b1bac4",
        brightBlack: "#6e7681",
        brightRed: "#ffa198",
        brightGreen: "#56d364",
        brightYellow: "#e3b341",
        brightBlue: "#79c0ff",
        brightMagenta: "#d2a8ff",
        brightCyan: "#39d0d8",
        brightWhite: "#f0f6fc",
      },
      cols: 120,
      rows: 30,
      scrollback: 1000,
    });

    // Initialize addons
    this.fitAddon = new FitAddon();
    this.terminal.loadAddon(this.fitAddon);
    this.terminal.loadAddon(new WebLinksAddon());

    // Open terminal in container
    this.terminal.open(this.container);
    this.fitAddon.fit();

    // Handle window resize
    window.addEventListener("resize", () => {
      this.fitAddon.fit();
    });

    // Welcome message
    this.writeWelcome();
  }

  private writeWelcome(): void {
    const welcome = `\x1b[36m╭─────────────────────────────────────────────────────────────────────────────────╮\x1b[0m
\x1b[36m│\x1b[0m \x1b[1;33m🚀 Application Terminal\x1b[0m                                                        \x1b[36m│\x1b[0m
\x1b[36m│\x1b[0m Connected to backend logs...                                                      \x1b[36m│\x1b[0m
\x1b[36m│\x1b[0m Ready for file uploads, API monitoring, and real-time logs                       \x1b[36m│\x1b[0m
\x1b[36m╰─────────────────────────────────────────────────────────────────────────────────╯\x1b[0m

`;
    this.terminal.write(welcome);
  }

  // Connect to WebSocket for real-time logs
  public connectWebSocket(wsUrl: string): void {
    try {
      this.websocket = new WebSocket(wsUrl);

      this.websocket.onopen = () => {
        this.logMessage({
          type: "success",
          message: `WebSocket connected to ${wsUrl}`,
          category: "CONNECTION",
        });
      };

      this.websocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.logMessage(data);
        } catch (error) {
          // Handle plain text messages
          this.logMessage({
            type: "info",
            message: event.data,
            category: "WEBSOCKET",
          });
        }
      };

      this.websocket.onerror = () => {
        this.logMessage({
          type: "error",
          message: "WebSocket connection error",
          category: "CONNECTION",
        });
      };

      this.websocket.onclose = (event) => {
        const reason = event.wasClean
          ? "Clean disconnect"
          : "Unexpected disconnect";
        this.logMessage({
          type: "warning",
          message: `WebSocket closed: ${reason}`,
          category: "CONNECTION",
        });
      };
    } catch (error) {
      this.logMessage({
        type: "error",
        message: `Failed to connect WebSocket: ${(error as Error).message}`,
        category: "CONNECTION",
      });
    }
  }

  // Log a message with color coding and timestamp
  public logMessage(log: LogMessage): void {
    const timestamp = log.timestamp || new Date();
    const timeStr = timestamp.toLocaleTimeString();

    let colorCode = "";
    let prefix = "";
    let emoji = "";

    switch (log.type) {
      case "error":
        colorCode = "\x1b[91m"; // Bright Red
        prefix = "ERROR";
        emoji = "❌";
        break;
      case "success":
        colorCode = "\x1b[92m"; // Bright Green
        prefix = "SUCCESS";
        emoji = "✅";
        break;
      case "warning":
        colorCode = "\x1b[93m"; // Bright Yellow
        prefix = "WARNING";
        emoji = "⚠️";
        break;
      case "info":
      default:
        colorCode = "\x1b[96m"; // Bright Cyan
        prefix = "INFO";
        emoji = "ℹ️";
        break;
    }

    const category = log.category ? `\x1b[90m[${log.category}]\x1b[0m ` : "";
    const formattedMessage = `${colorCode}[${timeStr}] ${emoji} ${prefix}\x1b[0m ${category}${log.message}\r\n`;
    this.terminal.write(formattedMessage);
  }

  // Log file upload progress
  public logFileUpload(fileName: string, progress: number): void {
    const progressBar = this.createProgressBar(progress);
    this.terminal.write(
      `\x1b[2K\r\x1b[96m📤 Uploading ${fileName} ${progressBar} ${progress}%\x1b[0m`
    );

    if (progress === 100) {
      this.terminal.write("\r\n");
    }
  }

  // Log file upload completion
  public logFileUploadComplete(fileName: string, fileSize: string): void {
    this.logMessage({
      type: "success",
      message: `File uploaded: ${fileName} (${fileSize})`,
      category: "UPLOAD",
    });
  }

  // Log file upload error
  public logFileUploadError(fileName: string, error: string): void {
    this.logMessage({
      type: "error",
      message: `Upload failed: ${fileName} - ${error}`,
      category: "UPLOAD",
    });
  }

  // Log API requests
  public logApiRequest(
    method: string,
    endpoint: string,
    status?: number,
    duration?: number
  ): void {
    const statusText = status ? ` (${status})` : "";
    const durationText = duration ? ` in ${duration}ms` : "";
    const type =
      status && status >= 200 && status < 300
        ? "success"
        : status && status >= 400
        ? "error"
        : "info";

    this.logMessage({
      type,
      message: `${method} ${endpoint}${statusText}${durationText}`,
      category: "API",
    });
  }

  // Log test execution
  public logTestExecution(
    testName: string,
    status: "running" | "passed" | "failed",
    details?: string
  ): void {
    let type: "info" | "success" | "error" = "info";
    let emoji = "🧪";

    switch (status) {
      case "running":
        type = "info";
        emoji = "⚡";
        break;
      case "passed":
        type = "success";
        emoji = "✅";
        break;
      case "failed":
        type = "error";
        emoji = "❌";
        break;
    }

    const message = details ? `${testName}: ${details}` : testName;
    this.logMessage({
      type,
      message: `${emoji} Test ${status}: ${message}`,
      category: "TEST",
    });
  }

  // Log schema operations
  public logSchemaOperation(operation: string, schemaName?: string): void {
    this.logMessage({
      type: "info",
      message: `${operation}${schemaName ? ` - ${schemaName}` : ""}`,
      category: "SCHEMA",
    });
  }

  private createProgressBar(progress: number, width: number = 20): string {
    const filled = Math.round((progress / 100) * width);
    const empty = width - filled;
    return `[\x1b[92m${"█".repeat(filled)}\x1b[90m${"░".repeat(empty)}\x1b[0m]`;
  }

  // Clear terminal
  public clear(): void {
    this.terminal.clear();
    this.writeWelcome();
  }

  // Resize terminal
  public resize(): void {
    this.fitAddon.fit();
  }

  // Send command to backend (if needed)
  public sendCommand(command: string): void {
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.send(
        JSON.stringify({
          type: "command",
          data: command,
        })
      );

      this.logMessage({
        type: "info",
        message: `Command sent: ${command}`,
        category: "COMMAND",
      });
    } else {
      this.logMessage({
        type: "error",
        message: "WebSocket not connected - cannot send command",
        category: "COMMAND",
      });
    }
  }

  // Cleanup
  public dispose(): void {
    if (this.websocket) {
      this.websocket.close();
    }
    this.terminal.dispose();
    window.removeEventListener("resize", () => {
      this.fitAddon.fit();
    });
  }

  // Get terminal instance for advanced usage
  public getTerminal(): Terminal {
    return this.terminal;
  }
}
