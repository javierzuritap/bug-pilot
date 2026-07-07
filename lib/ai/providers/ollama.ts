import { createOpenAI } from "@ai-sdk/openai";
import { PROVIDER_CATALOG } from "../catalog";
import { AIProviderError, type AIProvider, type AIProviderConfig } from "../types";

const meta = PROVIDER_CATALOG.ollama;

async function checkOllamaServer(baseUrl: string, modelId: string) {
  let response: Response;
  try {
    response = await fetch(`${baseUrl}/api/tags`, { signal: AbortSignal.timeout(3000) });
  } catch {
    throw new AIProviderError(
      "provider_unavailable",
      "ollama",
      `Couldn't reach Ollama at ${baseUrl}. Make sure it's running (\`ollama serve\`) and the URL is correct.`
    );
  }

  if (!response.ok) {
    throw new AIProviderError(
      "provider_unavailable",
      "ollama",
      `Ollama responded but something's off at ${baseUrl}. Check the URL in settings.`
    );
  }

  const data = (await response.json()) as { models?: { name: string }[] };
  const names = data.models?.map((m) => m.name) ?? [];
  const hasModel = names.some((name) => name === modelId || name.startsWith(`${modelId}:`));

  if (!hasModel) {
    throw new AIProviderError(
      "model_not_found",
      "ollama",
      `Ollama is running, but the model "${modelId}" isn't pulled yet. Run: ollama pull ${modelId}`
    );
  }
}

export const ollamaProvider: AIProvider = {
  id: meta.id,
  label: meta.label,
  requiresApiKey: meta.requiresApiKey,
  requiresBaseUrl: meta.requiresBaseUrl,
  defaultModel: meta.defaultModel,

  async createModel({ model, baseUrl }: AIProviderConfig) {
    const resolvedBaseUrl = (baseUrl || process.env.OLLAMA_BASE_URL || "http://localhost:11434").replace(
      /\/+$/,
      ""
    );
    const modelId = model || process.env.OLLAMA_MODEL || meta.defaultModel;

    await checkOllamaServer(resolvedBaseUrl, modelId);

    const ollama = createOpenAI({ baseURL: `${resolvedBaseUrl}/v1`, apiKey: "ollama" });
    return ollama(modelId);
  },
};
