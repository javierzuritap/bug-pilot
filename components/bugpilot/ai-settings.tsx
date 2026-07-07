"use client";

import { Settings2, ExternalLink } from "lucide-react";
import { PROVIDER_CATALOG, PROVIDER_ORDER } from "@/lib/ai/catalog";
import type { AiProviderId } from "@/lib/ai/types";
import { useAIConfig } from "@/hooks/use-ai-config";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const PROVIDER_DESCRIPTIONS: Record<AiProviderId, string> = {
  demo: "Scripted questions, instant sample report. No setup, no cost, no key.",
  gemini: "Google's free tier. No credit card needed — just an AI Studio key.",
  claude: "The best interviewer. Needs a paid Anthropic API key.",
  ollama: "Runs fully on your machine, for free. Needs Ollama installed locally.",
};

export function AISettings({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { config, update } = useAIConfig();
  const meta = PROVIDER_CATALOG[config.providerId];

  if (!open) {
    return (
      <button
        onClick={() => onOpenChange(true)}
        className="mx-auto flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <Settings2 className="size-3.5" />
        AI provider: <span className="font-medium text-foreground">{meta.label}</span>
      </button>
    );
  }

  return (
    <div className="w-full max-w-xl rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">AI provider</p>
        <button
          onClick={() => onOpenChange(false)}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Done
        </button>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {PROVIDER_ORDER.map((id) => {
          const provider = PROVIDER_CATALOG[id];
          const active = config.providerId === id;
          return (
            <button
              key={id}
              onClick={() => update({ providerId: id })}
              className={cn(
                "flex flex-col gap-0.5 rounded-lg border px-3 py-2.5 text-left transition-colors",
                active ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"
              )}
            >
              <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                <span
                  className={cn(
                    "flex size-3.5 items-center justify-center rounded-full border",
                    active ? "border-primary" : "border-muted-foreground/40"
                  )}
                >
                  {active && <span className="size-1.5 rounded-full bg-primary" />}
                </span>
                {provider.label}
              </span>
              <span className="pl-6 text-xs text-muted-foreground">{PROVIDER_DESCRIPTIONS[id]}</span>
            </button>
          );
        })}
      </div>

      {meta.requiresApiKey && (
        <div className="mt-4 flex flex-col gap-1.5">
          <Label htmlFor="ai-api-key">
            {meta.label} API key
            {meta.apiKeyHelpUrl && (
              <a
                href={meta.apiKeyHelpUrl}
                target="_blank"
                rel="noreferrer"
                className="ml-1.5 inline-flex items-center gap-1 text-primary hover:underline"
              >
                get one <ExternalLink className="size-3" />
              </a>
            )}
          </Label>
          <Input
            id="ai-api-key"
            type="password"
            placeholder="Pasted here, kept only in this browser"
            value={config.apiKey}
            onChange={(e) => update({ apiKey: e.target.value })}
          />
        </div>
      )}

      {meta.requiresBaseUrl && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ai-base-url">Ollama URL</Label>
            <Input
              id="ai-base-url"
              placeholder="http://localhost:11434"
              value={config.baseUrl}
              onChange={(e) => update({ baseUrl: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ai-model">Model</Label>
            <Input
              id="ai-model"
              placeholder={meta.defaultModel}
              value={config.model}
              onChange={(e) => update({ model: e.target.value })}
            />
          </div>
        </div>
      )}

      {!meta.requiresApiKey && !meta.requiresBaseUrl && meta.id !== "demo" && (
        <div className="mt-4 flex flex-col gap-1.5">
          <Label htmlFor="ai-model">Model</Label>
          <Input
            id="ai-model"
            placeholder={meta.defaultModel}
            value={config.model}
            onChange={(e) => update({ model: e.target.value })}
          />
        </div>
      )}

      <p className="mt-4 text-xs text-muted-foreground/70">
        Saved only in this browser's local storage. Sent to the server only as a header on each request —
        never stored there.
      </p>
    </div>
  );
}
