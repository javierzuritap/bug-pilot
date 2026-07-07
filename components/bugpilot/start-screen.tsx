"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AISettings } from "@/components/bugpilot/ai-settings";

const EXAMPLES = [
  "The export button does nothing when the cart is empty",
  "Login silently fails on Safari after the password reset",
  "Dashboard chart flickers and shows stale data on refresh",
];

export function StartScreen({ onStart }: { onStart: (description: string) => void }) {
  const [value, setValue] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);

  function submit() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onStart(trimmed);
  }

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-xl"
      >
        <div className="mb-8 text-center">
          <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Turn one messy sentence into a bug report worth reading.
          </h1>
          <p className="mt-3 text-balance text-sm text-muted-foreground sm:text-base">
            No forms. BugPilot interviews you, then writes it up.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-2 panel-glow">
          <Textarea
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
            }}
            placeholder="Describe your bug in one sentence…"
            className="min-h-[120px] resize-none border-0 bg-transparent text-base shadow-none focus-visible:ring-0"
          />
          <div className="flex items-center justify-between gap-3 border-t border-border/60 px-3 py-2.5">
            <span className="text-xs text-muted-foreground/70">⌘ + Enter to start</span>
            <Button onClick={submit} disabled={!value.trim()} size="sm" className="gap-1.5">
              Start Interview
              <ArrowRight className="size-3.5" />
            </Button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {EXAMPLES.map((example) => (
            <button
              key={example}
              onClick={() => setValue(example)}
              className="rounded-full border border-border/70 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
            >
              {example}
            </button>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <AISettings open={settingsOpen} onOpenChange={setSettingsOpen} />
        </div>
      </motion.div>
    </div>
  );
}
