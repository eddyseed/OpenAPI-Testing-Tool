// frontend/src/services/websocketClient.ts
import { io, Socket } from 'socket.io-client';

export interface LogMessage {
    type: 'log' | 'command' | 'info' | 'error' | 'success';
    message: string;
    timestamp: string;
    source: string;
    level?: string;
}

export type MessageCallback = (message: LogMessage) => void;
export type ConnectionCallback = (connected: boolean) => void;

export class WebSocketClient {
    private socket: Socket | null = null;
    private messageCallbacks: MessageCallback[] = [];
    private connectionCallbacks: ConnectionCallback[] = [];
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 1000;

    constructor(private serverUrl: string = 'http://localhost:3001') {
        this.connect();
    }

    private connect(): void {
        try {
            this.socket = io(this.serverUrl, {
                transports: ['websocket'],
                autoConnect: true,
                reconnection: true,
                reconnectionDelay: this.reconnectDelay,
                reconnectionAttempts: this.maxReconnectAttempts
            });

            this.setupEventHandlers();
        } catch (error) {
            console.error('Failed to initialize WebSocket connection:', error);
            this.handleConnectionError();
        }
    }

    private setupEventHandlers(): void {
        if (!this.socket) return;

        // Connection established
        this.socket.on('connect', () => {
            console.log('Connected to WebSocket server');
            this.reconnectAttempts = 0;
            this.notifyConnectionCallbacks(true);

            // Send a test message to confirm connection
            this.addMessage({
                type: 'success',
                message: 'Connected to WebSocket server\r\n',
                timestamp: new Date().toISOString(),
                source: 'client'
            });
        });

        // Disconnection
        this.socket.on('disconnect', (reason) => {
            console.log('Disconnected from WebSocket server:', reason);
            this.notifyConnectionCallbacks(false);

            this.addMessage({
                type: 'error',
                message: `Disconnected from server: ${reason}\r\n`,
                timestamp: new Date().toISOString(),
                source: 'client'
            });

            // Handle reconnection
            if (reason === 'io server disconnect') {
                // Server initiated disconnect, try to reconnect
                this.handleReconnection();
            }
        });

        // Receive terminal output from server
        this.socket.on('terminal:output', (data: LogMessage) => {
            this.addMessage(data);
        });

        // Connection error
        this.socket.on('connect_error', (error) => {
            console.error('WebSocket connection error:', error);
            this.handleConnectionError();
        });

        // Reconnection attempt
        this.socket.on('reconnect_attempt', (attemptNumber) => {
            console.log(`Attempting to reconnect... (${attemptNumber})`);
            this.addMessage({
                type: 'info',
                message: `Attempting to reconnect... (${attemptNumber})\r\n`,
                timestamp: new Date().toISOString(),
                source: 'client'
            });
        });

        // Successful reconnection
        this.socket.on('reconnect', (attemptNumber) => {
            console.log(`Reconnected after ${attemptNumber} attempts`);
            this.addMessage({
                type: 'success',
                message: `Reconnected after ${attemptNumber} attempts\r\n`,
                timestamp: new Date().toISOString(),
                source: 'client'
            });
        });

        // Failed reconnection
        this.socket.on('reconnect_failed', () => {
            console.error('Failed to reconnect to WebSocket server');
            this.addMessage({
                type: 'error',
                message: 'Failed to reconnect to server. Please refresh the page.\r\n',
                timestamp: new Date().toISOString(),
                source: 'client'
            });
        });
    }

    private handleConnectionError(): void {
        this.reconnectAttempts++;
        this.notifyConnectionCallbacks(false);

        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            this.addMessage({
                type: 'error',
                message: 'Max reconnection attempts reached. Please refresh the page.\r\n',
                timestamp: new Date().toISOString(),
                source: 'client'
            });
        }
    }

    private handleReconnection(): void {
        setTimeout(() => {
            if (this.socket) {
                this.socket.connect();
            }
        }, this.reconnectDelay);
    }

    private addMessage(message: LogMessage): void {
        this.messageCallbacks.forEach(callback => callback(message));
    }

    private notifyConnectionCallbacks(connected: boolean): void {
        this.connectionCallbacks.forEach(callback => callback(connected));
    }

    // Public methods

    public onMessage(callback: MessageCallback): () => void {
        this.messageCallbacks.push(callback);

        // Return unsubscribe function
        return () => {
            const index = this.messageCallbacks.indexOf(callback);
            if (index > -1) {
                this.messageCallbacks.splice(index, 1);
            }
        };
    }

    public onConnectionChange(callback: ConnectionCallback): () => void {
        this.connectionCallbacks.push(callback);

        // Return unsubscribe function
        return () => {
            const index = this.connectionCallbacks.indexOf(callback);
            if (index > -1) {
                this.connectionCallbacks.splice(index, 1);
            }
        };
    }

    public subscribeToLogs(sources: string[]): void {
        if (this.socket?.connected) {
            this.socket.emit('logs:subscribe', { sources });
        } else {
            console.error('WebSocket not connected');
        }
    }

    public unsubscribeFromLogs(sources: string[]): void {
        if (this.socket?.connected) {
            this.socket.emit('logs:unsubscribe', { sources });
        } else {
            console.error('WebSocket not connected');
        }
    }

    public sendCommand(command: string): void {
        if (this.socket?.connected) {
            this.socket.emit('terminal:command', { command });
        } else {
            this.addMessage({
                type: 'error',
                message: 'Cannot send command: WebSocket not connected\r\n',
                timestamp: new Date().toISOString(),
                source: 'client'
            });
        }
    }

    public isConnected(): boolean {
        return this.socket ? this.socket.connected : false;
    }

    public disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    public getConnectionId(): string | undefined {
        return this.socket ? this.socket.id : undefined;
    }
}