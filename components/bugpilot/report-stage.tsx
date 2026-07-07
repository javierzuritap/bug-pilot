"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { ScoreGrid } from "@/components/bugpilot/score-grid";
import { ReportPreview } from "@/components/bugpilot/report-preview";
import { ExportButtons } from "@/components/bugpilot/export-buttons";
import { Button } from "@/components/ui/button";
import type { BugReport } from "@/lib/schemas";

export function ReportStage({
  initialReport,
  onRestart,
}: {
  initialReport: BugReport;
  onRestart: () => void;
}) {
  const [report, setReport] = useState(initialReport);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Bug report ready</h1>
          <p className="text-sm text-muted-foreground">Review, tweak anything, then export it.</p>
        </div>
        <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" onClick={onRestart}>
          <RotateCcw className="size-3.5" />
          Start over
        </Button>
      </motion.div>

      <ScoreGrid report={report} />
      <ReportPreview report={initialReport} onChange={setReport} />

      <div className="sticky bottom-6 rounded-xl border border-border bg-card/95 p-4 backdrop-blur-md panel-glow">
        <ExportButtons report={report} />
      </div>
    </div>
  );
}
