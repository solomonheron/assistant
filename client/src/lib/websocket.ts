// WebSocket client for real-time chat communication

// Get WebSocket URL - use current host with port 8000 for Replit environment
const getWsUrl = () => {
  if (import.meta.env.VITE_WS_URL) {
    return import.meta.env.VITE_WS_URL;
  }
  
  // In Replit environment, use the same host but port 8000
  if (typeof window !== "undefined") {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.hostname;
    // For Replit, the backend runs on port 8000
    return `${protocol}//${host}:8000`;
  }
  
  return "ws://localhost:8000";
};

const WS_BASE_URL = getWsUrl();

export interface ChatMessage {
  id?: string;
  role: "user" | "assistant";
  content: string;
  model_used?: string;
  conversation_id?: string;
  timestamp?: Date;
}

export interface WSMessage {
  message: string;
  model_size?: "small" | "medium" | "large";
  conversation_id?: string;
}

export interface WSResponse {
  id: string;
  role: "assistant";
  content: string;
  model_used: string;
  conversation_id: string;
  error?: string;
}

type MessageHandler = (message: WSResponse) => void;
type ErrorHandler = (error: string) => void;
type CloseHandler = () => void;

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private messageHandlers: MessageHandler[] = [];
  private errorHandlers: ErrorHandler[] = [];
  private closeHandlers: CloseHandler[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.ws = new WebSocket(`${WS_BASE_URL}/api/chat/ws`);

    this.ws.onopen = () => {
      console.log("WebSocket connected");
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      try {
        const data: WSResponse = JSON.parse(event.data);
        if (data.error) {
          this.errorHandlers.forEach((handler) => handler(data.error!));
        } else {
          this.messageHandlers.forEach((handler) => handler(data));
        }
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      this.errorHandlers.forEach((handler) =>
        handler("WebSocket connection error")
      );
    };

    this.ws.onclose = () => {
      console.log("WebSocket disconnected");
      this.closeHandlers.forEach((handler) => handler());
      this.attemptReconnect();
    };
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`
      );
      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  sendMessage(message: WSMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not connected");
      this.errorHandlers.forEach((handler) =>
        handler("WebSocket is not connected")
      );
    }
  }

  onMessage(handler: MessageHandler): void {
    this.messageHandlers.push(handler);
  }

  onError(handler: ErrorHandler): void {
    this.errorHandlers.push(handler);
  }

  onClose(handler: CloseHandler): void {
    this.closeHandlers.push(handler);
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.messageHandlers = [];
    this.errorHandlers = [];
    this.closeHandlers = [];
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export const wsClient = new WebSocketClient();
