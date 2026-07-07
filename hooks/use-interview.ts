"use client";

import { useChat } from "ai/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { COMPLETE_INTERVIEW_TOOL, type BugReport } from "@/lib/schemas";
import { useAIConfig } from "@/hooks/use-ai-config";
import { configToHeaders } from "@/lib/ai-client-config";

interface UseInterviewOptions {
  onComplete: (report: BugReport) => void;
}

interface ProviderErrorState {
  message: string;
  code?: string;
}

export function useInterview({ onComplete }: UseInterviewOptions) {
  const hasCompleted = useRef(false);
  const { config, hydrated } = useAIConfig();
  const [providerError, setProviderError] = useState<ProviderErrorState | null>(null);

  const chat = useChat({
    api: "/api/interview",
    headers: configToHeaders(config),
    onError: async (error) => {
      try {
        const parsed = JSON.parse(error.message);
        setProviderError({ message: parsed.message, code: parsed.error });
      } catch {
        setProviderError({ message: "Something went wrong talking to the AI provider." });
      }
    },
    onResponse: () => setProviderError(null),
  });

  const { messages } = chat;

  useEffect(() => {
    if (hasCompleted.current) return;

    for (const message of messages) {
      const invocations = message.toolInvocations ?? [];
      const finished = invocations.find(
        (inv) => inv.toolName === COMPLETE_INTERVIEW_TOOL && inv.state !== "partial-call"
      );
      if (finished) {
        hasCompleted.current = true;
        onComplete(finished.args as BugReport);
        break;
      }
    }
  }, [messages, onComplete]);

  const visibleMessages = useMemo(
    () => messages.filter((m) => (m.content ?? "").trim().length > 0),
    [messages]
  );

  return { ...chat, visibleMessages, providerError, providerReady: hydrated };
}
