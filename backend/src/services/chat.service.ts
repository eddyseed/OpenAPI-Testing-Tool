import { OllamaClient } from "../lib/ollama.js";
import type {
  ChatMessage,
  ChatResult,
  GenerationOptions,
} from "../types/ollama.types.js";
import logger from "../lib/logger.js";
export class ChatService {
  private ollama: OllamaClient;
  private conversationHistory: ChatMessage[] = [];

  constructor() {
    this.ollama = new OllamaClient();
  }

  async initialize(): Promise<void> {
    await this.ollama.checkConnection();
    await this.ollama.pullModel();
    logger.info("Chat service initialized");
  }

  async processMessage(
    message: string,
    userId: string = "default",
    options?: GenerationOptions
  ): Promise<ChatResult> {
    try {
      // Add user message to history
      this.conversationHistory.push({
        role: "user",
        content: message,
        timestamp: new Date().toISOString(),
        userId,
      });
      // Build context from conversation history
      const context = this.buildContext();
      const prompt = `${context}\nUser: ${message}\nAssistant:`;

      // Generate response
      const result = await this.ollama.generateResponse(prompt, {
        temperature: 0.7,
        max_tokens: 500,
        ...options,
      });

      if (result.success && result.response) {
        // Add assistant response to history
        this.conversationHistory.push({
          role: "assistant",
          content: result.response,
          timestamp: new Date().toISOString(),
          userId,
        });

        // Keep only last 10 messages to prevent context overflow
        if (this.conversationHistory.length > 10) {
          this.conversationHistory = this.conversationHistory.slice(-10);
        }

        return {
          success: true,
          response: result.response,
          conversationId: userId,
        };
      }

      return {
        success: false,
        error: result.error || "Failed to generate response",
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logger.error("❌ Error processing message:", errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  private buildContext(): string {
    return this.conversationHistory
      .slice(-6) // Last 6 messages for context
      .map(
        (msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
      )
      .join("\n");
  }

  clearHistory(userId: string = "default"): void {
    this.conversationHistory = this.conversationHistory.filter(
      (msg) => msg.userId !== userId
    );
  }

  getHistory(userId: string = "default"): ChatMessage[] {
    return this.conversationHistory.filter((msg) => msg.userId === userId);
  }

  public get client(): OllamaClient {
    return this.ollama;
  }
}
