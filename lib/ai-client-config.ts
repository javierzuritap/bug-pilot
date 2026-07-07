import type { AiProviderId } from "@/lib/ai/types";

export interface AIClientConfig {
  providerId: AiProviderId;
  apiKey: string;
  model: string;
  baseUrl: string;
}

const STORAGE_KEY = "bugpilot:ai-config";

export const DEFAULT_AI_CONFIG: AIClientConfig = {
  providerId: "demo",
  apiKey: "",
  model: "",
  baseUrl: "",
};

export function loadAIConfig(): AIClientConfig {
  if (typeof window === "undefined") return DEFAULT_AI_CONFIG;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_AI_CONFIG;
    return { ...DEFAULT_AI_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_AI_CONFIG;
  }
}

export function saveAIConfig(config: AIClientConfig) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function configToHeaders(config: AIClientConfig): Record<string, string> {
  const headers: Record<string, string> = { "x-bugpilot-provider": config.providerId };
  if (config.apiKey) headers["x-bugpilot-api-key"] = config.apiKey;
  if (config.model) headers["x-bugpilot-model"] = config.model;
  if (config.baseUrl) headers["x-bugpilot-base-url"] = config.baseUrl;
  return headers;
}
