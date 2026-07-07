"use client";

import { useEffect, useState } from "react";
import { DEFAULT_AI_CONFIG, loadAIConfig, saveAIConfig, type AIClientConfig } from "@/lib/ai-client-config";

export function useAIConfig() {
  const [config, setConfig] = useState<AIClientConfig>(DEFAULT_AI_CONFIG);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setConfig(loadAIConfig());
    setHydrated(true);
  }, []);

  function update(partial: Partial<AIClientConfig>) {
    setConfig((prev) => {
      const next = { ...prev, ...partial };
      saveAIConfig(next);
      return next;
    });
  }

  return { config, update, hydrated };
}
