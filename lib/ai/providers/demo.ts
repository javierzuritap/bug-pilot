import { MockLanguageModelV1 } from "ai/test";
import { simulateReadableStream } from "ai";
import type { LanguageModelV1Prompt } from "@ai-sdk/provider";
import { COMPLETE_INTERVIEW_TOOL } from "@/lib/schemas";
import { DEMO_QUESTIONS, buildDemoReport } from "../demo-script";
import { PROVIDER_CATALOG } from "../catalog";
import type { AIProvider } from "../types";

const meta = PROVIDER_CATALOG.demo;

function extractUserTexts(prompt: LanguageModelV1Prompt) {
  return prompt
    .filter((message) => message.role === "user")
    .map((message) =>
      message.content
        .filter((part) => part.type === "text")
        .map((part) => part.text)
        .join(" ")
    );
}

export const demoProvider: AIProvider = {
  id: meta.id,
  label: meta.label,
  requiresApiKey: meta.requiresApiKey,
  requiresBaseUrl: meta.requiresBaseUrl,
  defaultModel: meta.defaultModel,

  async createModel() {
    return new MockLanguageModelV1({
      provider: "demo",
      modelId: meta.defaultModel,
      doStream: async ({ prompt }) => {
        const userTexts = extractUserTexts(prompt);
        const description = userTexts[0] ?? "";
        const answers = userTexts.slice(1);

        if (answers.length < DEMO_QUESTIONS.length) {
          const question = DEMO_QUESTIONS[answers.length];
          return {
            stream: simulateReadableStream({
              initialDelayInMs: 350,
              chunkDelayInMs: 15,
              chunks: [
                { type: "text-delta", textDelta: question },
                { type: "finish", finishReason: "stop", usage: { promptTokens: 0, completionTokens: 0 } },
              ],
            }),
            rawCall: { rawPrompt: prompt, rawSettings: {} },
          };
        }

        const report = buildDemoReport(description, answers);

        return {
          stream: simulateReadableStream({
            initialDelayInMs: 500,
            chunkDelayInMs: 0,
            chunks: [
              {
                type: "tool-call",
                toolCallType: "function",
                toolCallId: `demo-${Date.now()}`,
                toolName: COMPLETE_INTERVIEW_TOOL,
                args: JSON.stringify(report),
              },
              { type: "finish", finishReason: "tool-calls", usage: { promptTokens: 0, completionTokens: 0 } },
            ],
          }),
          rawCall: { rawPrompt: prompt, rawSettings: {} },
        };
      },
    });
  },
};
