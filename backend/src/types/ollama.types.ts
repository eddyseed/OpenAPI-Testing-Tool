export interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

export interface GenerationOptions {
  temperature?: number;
  top_p?: number;
  top_k?: number;
  max_tokens?: number;
  stop?: string[];
  repeat_penalty?: number;
  seed?: number;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  userId: string;
}
export interface GenerationResult {
  success: boolean;
  response?: string;
  model?: string;
  created_at?: string;
  done?: boolean;
  error?: string;
}
export interface ChatResult {
  success: boolean;
  response?: string;
  conversationId?: string;
  error?: string;
}
export interface Task {
  type: "chat" | "batch_process";
  timestamp: string;
  message?: string;
  userId?: string;
  messages?: Array<{ text: string; userId: string }>;
  callback?: (result: ChatResult) => void;
}

export interface WorkerStatus {
  isRunning: boolean;
  queueLength: number;
  model: string;
}

export interface ModelInfo {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
}

export interface HealthStatus {
  success: boolean;
  status: "healthy" | "unhealthy";
  error?: string;
}
