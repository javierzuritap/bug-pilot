"use client";

import { useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { useInterview } from "@/hooks/use-interview";
import { ChatMessage } from "@/components/bugpilot/chat-message";
import { TypingIndicator } from "@/components/bugpilot/typing-indicator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { BugReport } from "@/lib/schemas";

export function ChatInterview({
  initialDescription,
  onComplete,
}: {
  initialDescription: string;
  onComplete: (report: BugReport) => void;
}) {
  const hasSeeded = useRef(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { visibleMessages, input, handleInputChange, handleSubmit, isLoading, append, providerError, providerReady } =
    useInterview({ onComplete });

  useEffect(() => {
    if (hasSeeded.current || !providerReady) return;
    hasSeeded.current = true;
    append({ role: "user", content: initialDescription });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialDescription, providerReady]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visibleMessages, isLoading]);

  const questionsAsked = visibleMessages.filter((m) => m.role === "assistant").length;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 py-6">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          BugPilot is interviewing you
          {questionsAsked > 0 && (
            <span className="text-muted-foreground/60"> · question {questionsAsked}</span>
          )}
        </p>
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={`h-1 w-4 rounded-full transition-colors ${
                i < questionsAsked ? "bg-primary" : "bg-border"
              }`}
            />
          ))}
        </div>
      </div>

      <ScrollArea className="min-h-[420px] flex-1 rounded-xl border border-border bg-card/40 p-5">
        <div className="flex flex-col gap-3">
          {visibleMessages.map((m) => (
            <ChatMessage key={m.id} role={m.role === "user" ? "user" : "assistant"} content={m.content} />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {providerError && (
        <div className="mt-3 rounded-lg border border-signal-high/30 bg-signal-high/10 px-4 py-3 text-sm text-signal-high">
          {providerError.message}
        </div>
      )}

      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
        className="mt-4 flex items-end gap-2 rounded-xl border border-border bg-card p-2"
      >
        <Textarea
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              (e.currentTarget.form as HTMLFormElement).requestSubmit();
            }
          }}
          placeholder="Type your answer…"
          disabled={isLoading}
          className="min-h-[44px] resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
        />
        <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  );
}
