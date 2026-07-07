"use client";

import { useState } from "react";
import { Check, ClipboardCopy, FileJson, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { reportToJiraJson, reportToMarkdown } from "@/lib/export";
import type { BugReport } from "@/lib/schemas";

type Format = "markdown" | "json";

export function ExportButtons({ report }: { report: BugReport }) {
  const [copied, setCopied] = useState<Format | null>(null);

  async function copy(format: Format) {
    const text =
      format === "markdown"
        ? reportToMarkdown(report)
        : JSON.stringify(reportToJiraJson(report), null, 2);

    await navigator.clipboard.writeText(text);
    setCopied(format);
    setTimeout(() => setCopied(null), 1800);
  }

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <Button variant="secondary" className="gap-2" onClick={() => copy("markdown")}>
        {copied === "markdown" ? <Check className="size-4 text-signal-low" /> : <FileText className="size-4" />}
        Copy as Markdown
      </Button>
      <Button variant="secondary" className="gap-2" onClick={() => copy("json")}>
        {copied === "json" ? <Check className="size-4 text-signal-low" /> : <FileJson className="size-4" />}
        Copy as JSON
      </Button>
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
        <ClipboardCopy className="size-3" />
        Copies straight to your clipboard
      </span>
    </div>
  );
}
