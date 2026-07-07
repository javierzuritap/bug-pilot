import { createAnthropic } from "@ai-sdk/anthropic";
import { PROVIDER_CATALOG } from "../catalog";
import { AIProviderError, type AIProvider, type AIProviderConfig } from "../types";

const meta = PROVIDER_CATALOG.claude;

export const claudeProvider: AIProvider = {
  id: meta.id,
  label: meta.label,
  requiresApiKey: meta.requiresApiKey,
  requiresBaseUrl: meta.requiresBaseUrl,
  defaultModel: meta.defaultModel,

  async createModel({ apiKey, model }: AIProviderConfig) {
    const key = apiKey || process.env.ANTHROPIC_API_KEY;
    if (!key) {
      throw new AIProviderError(
        "missing_api_key",
        "claude",
        "No Anthropic API key found. Add one in the settings panel or set ANTHROPIC_API_KEY."
      );
    }
    const modelId = model || process.env.ANTHROPIC_MODEL || meta.defaultModel;
    return createAnthropic({ apiKey: key })(modelId);
  },
};
