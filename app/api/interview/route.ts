import { streamText, tool, type CoreMessage } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { bugReportSchema, COMPLETE_INTERVIEW_TOOL } from "@/lib/schemas";
import { INTERVIEWER_SYSTEM_PROMPT } from "@/lib/prompts";
import { resolveAIModel } from "@/lib/ai/resolver";
import { AIProviderError } from "@/lib/ai/types";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const { messages }: { messages: CoreMessage[] } = await req.json();

  const providerId = req.headers.get("x-bugpilot-provider");
  const apiKey = req.headers.get("x-bugpilot-api-key");
  const model = req.headers.get("x-bugpilot-model");
  const baseUrl = req.headers.get("x-bugpilot-base-url");

  let resolved;
  try {
    resolved = await resolveAIModel({ providerId, apiKey, model, baseUrl });
  } catch (error) {
    if (error instanceof AIProviderError) {
      const status = error.code === "missing_api_key" ? 401 : 503;
      return NextResponse.json({ error: error.code, message: error.message }, { status });
    }
    throw error;
  }

  const result = streamText({
    model: resolved.model,
    system: INTERVIEWER_SYSTEM_PROMPT,
    messages,
    tools: {
      [COMPLETE_INTERVIEW_TOOL]: tool({
        description:
          "Call this once you have enough information to write a complete, professional bug report. This ends the interview.",
        parameters: bugReportSchema,
      }),
    },
    toolChoice: "auto",
    temperature: 0.5,
  });

  return result.toDataStreamResponse();
}
