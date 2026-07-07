import type { LanguageModel } from "ai";

export type AiProviderId = "claude" | "gemini" | "ollama" | "demo";

export interface AIProviderConfig {
  apiKey?: string | null;
  model?: string | null;
  baseUrl?: string | null;
}

export type AIProviderErrorCode = "missing_api_key" | "provider_unavailable" | "model_not_found";

export class AIProviderError extends Error {
  code: AIProviderErrorCode;
  providerId: AiProviderId;

  constructor(code: AIProviderErrorCode, providerId: AiProviderId, message: string) {
    super(message);
    this.code = code;
    this.providerId = providerId;
  }
}

export interface AIProvider {
  id: AiProviderId;
  label: string;
  requiresApiKey: boolean;
  requiresBaseUrl: boolean;
  defaultModel: string;
  createModel(config: AIProviderConfig): Promise<LanguageModel>;
}
