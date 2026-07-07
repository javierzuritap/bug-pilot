import type { AiProviderId } from "./types";

export interface ProviderMeta {
  id: AiProviderId;
  label: string;
  requiresApiKey: boolean;
  requiresBaseUrl: boolean;
  defaultModel: string;
  apiKeyHelpUrl?: string;
}

export const PROVIDER_CATALOG: Record<AiProviderId, ProviderMeta> = {
  demo: {
    id: "demo",
    label: "Demo",
    requiresApiKey: false,
    requiresBaseUrl: false,
    defaultModel: "demo-script-v1",
  },
  gemini: {
    id: "gemini",
    label: "Gemini",
    requiresApiKey: true,
    requiresBaseUrl: false,
    defaultModel: "gemini-2.5-flash",
    apiKeyHelpUrl: "https://aistudio.google.com/apikey",
  },
  claude: {
    id: "claude",
    label: "Claude",
    requiresApiKey: true,
    requiresBaseUrl: false,
    defaultModel: "claude-sonnet-5",
    apiKeyHelpUrl: "https://console.anthropic.com/settings/keys",
  },
  ollama: {
    id: "ollama",
    label: "Ollama",
    requiresApiKey: false,
    requiresBaseUrl: true,
    defaultModel: "llama3.2",
  },
};

export const PROVIDER_ORDER: AiProviderId[] = ["demo", "gemini", "claude", "ollama"];
