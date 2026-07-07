import { claudeProvider } from "./providers/claude";
import { geminiProvider } from "./providers/gemini";
import { ollamaProvider } from "./providers/ollama";
import { demoProvider } from "./providers/demo";
import { PROVIDER_ORDER } from "./catalog";
import type { AIProvider, AIProviderConfig, AiProviderId } from "./types";

const PROVIDERS: Record<AiProviderId, AIProvider> = {
  claude: claudeProvider,
  gemini: geminiProvider,
  ollama: ollamaProvider,
  demo: demoProvider,
};

function isValidProviderId(value: string | null | undefined): value is AiProviderId {
  return !!value && (PROVIDER_ORDER as string[]).includes(value);
}

export function getProviderMeta(id: AiProviderId): AIProvider {
  return PROVIDERS[id];
}

interface ResolveInput extends AIProviderConfig {
  providerId?: string | null;
}

export async function resolveAIModel(input: ResolveInput) {
  const providerId: AiProviderId = isValidProviderId(input.providerId)
    ? input.providerId
    : isValidProviderId(process.env.AI_PROVIDER)
      ? (process.env.AI_PROVIDER as AiProviderId)
      : "demo";

  const provider = PROVIDERS[providerId];
  const model = await provider.createModel(input);

  return { model, providerId, providerLabel: provider.label };
}
