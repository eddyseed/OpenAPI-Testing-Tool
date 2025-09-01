import axios, { type AxiosInstance } from "axios";
import dotenv from "dotenv";
import logger from "./logger.js";
dotenv.config();
import type {
  OllamaResponse,
  GenerationOptions,
  GenerationResult,
  ModelInfo,
} from "../types/ollama.types.js";

export class OllamaClient {
  private client: AxiosInstance;
  public readonly model: string;
  private readonly baseURL: string;

  constructor() {
    this.baseURL = process.env.OLLAMA_HOST || "http://localhost:11434"; // Local URL for hosting the LLM Server
    this.model = process.env.MODEL_NAME || "phi3:mini"; // Name of the model being used (By default phi3:mini)

    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  async checkConnection(): Promise<{ models: ModelInfo[] }> {
    try {
      const response = await this.client.get<{ models: ModelInfo[] }>(
        "/api/tags"
      );
      logger.info(`Connected to Ollama (${this.model}) successfully!`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logger.error("❌ Failed to connect to Ollama:", errorMessage);
      throw new Error(`Connection failed: ${errorMessage}`);
    }
  }

  async pullModel(): Promise<void> {
    try {
      logger.info(`Pulling model: ${this.model}`);
      await this.client.post("/api/pull", {
        name: this.model,
      });
      logger.info(`Model ${this.model} is ready`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logger.error("❌ Failed to pull model:", errorMessage);
      throw new Error(`Model pull failed: ${errorMessage}`);
    }
  }

  async generateResponse(
    prompt: string,
    options: GenerationOptions = {}
  ): Promise<GenerationResult> {
    try {
      const payload = {
        model: this.model,
        prompt: prompt,
        stream: false,
        options: {
          temperature: options.temperature || 0.7,
          top_p: options.top_p || 0.9,
          max_tokens: options.max_tokens || 1000,
          ...options,
        },
      };

      logger.info(` Generating response for: "${prompt}..."`);

      const response = await this.client.post<OllamaResponse>(
        "/api/generate",
        payload
      );

      if (response.data && response.data.response) {
        logger.info("Response generated successfully");
        return {
          success: true,
          response: response.data.response,
          model: response.data.model,
          created_at: response.data.created_at,
          done: response.data.done,
        };
      }

      throw new Error("Invalid response format");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logger.error("❌ Failed to generate response:", errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  async generateStream(
    prompt: string,
    onChunk: (chunk: string) => void,
    options: GenerationOptions = {}
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const payload = {
        model: this.model,
        prompt: prompt,
        stream: true,
        options: {
          temperature: options.temperature || 0.7,
          ...options,
        },
      };

      const response = await this.client.post("/api/generate", payload, {
        responseType: "stream",
      });

      response.data.on("data", (chunk: Buffer) => {
        const lines = chunk.toString().split("\n");
        lines.forEach((line) => {
          if (line.trim()) {
            try {
              const data = JSON.parse(line) as Partial<OllamaResponse>;
              if (data.response) {
                onChunk(data.response);
              }
            } catch (e) {
              // Ignore malformed JSON chunks
            }
          }
        });
      });

      return new Promise((resolve, reject) => {
        response.data.on("end", () => resolve({ success: true }));
        response.data.on("error", (error: Error) => reject(error));
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logger.error("❌ Failed to generate streaming response:", errorMessage);
      throw new Error(`Streaming failed: ${errorMessage}`);
    }
  }
}
