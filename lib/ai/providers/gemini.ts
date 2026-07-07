import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { PROVIDER_CATALOG } from "../catalog";
import { AIProviderError, type AIProvider, type AIProviderConfig } from "../types";

const meta = PROVIDER_CATALOG.gemini;

export const geminiProvider: AIProvider = {
  id: meta.id,
  label: meta.label,
  requiresApiKey: meta.requiresApiKey,
  requiresBaseUrl: meta.requiresBaseUrl,
  defaultModel: meta.defaultModel,

  async createModel({ apiKey, model }: AIProviderConfig) {
    const key = apiKey || process.env.GEMINI_API_KEY;
    if (!key) {
      throw new AIProviderError(
        "missing_api_key",
        "gemini",
        `No Gemini API key found. Add one in the settings panel or set GEMINI_API_KEY. Get a free one at ${meta.apiKeyHelpUrl}.`
      );
    }
    const modelId = model || process.env.GEMINI_MODEL || meta.defaultModel;
    return createGoogleGenerativeAI({ apiKey: key })(modelId);
  },
};
