"use client";

import { AlertTriangle, Gauge, ShieldCheck, Sparkles } from "lucide-react";
import { ScoreCard } from "@/components/bugpilot/score-card";
import { severityLevels, priorityLevels, type BugReport } from "@/lib/schemas";

const SEVERITY_COLOR: Record<string, string> = {
  Low: "hsl(var(--signal-low))",
  Medium: "hsl(var(--signal-medium))",
  High: "hsl(var(--signal-high))",
  Critical: "hsl(var(--signal-critical))",
};

const PRIORITY_COLOR: Record<string, string> = {
  P4: "hsl(var(--signal-low))",
  P3: "hsl(var(--signal-medium))",
  P2: "hsl(var(--signal-high))",
  P1: "hsl(var(--signal-critical))",
};

function levelToValue(index: number, total: number) {
  // Center of the segment the level occupies, on a 0-100 scale.
  return ((index + 0.5) / total) * 100;
}

export function ScoreGrid({ report }: { report: BugReport }) {
  const severityIndex = severityLevels.indexOf(report.severity);
  const priorityIndex = priorityLevels.indexOf(report.priority);

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <ScoreCard
        icon={<AlertTriangle className="size-3.5" />}
        title="Severity"
        value={levelToValue(severityIndex, severityLevels.length)}
        displayValue={report.severity.toUpperCase()}
        color={SEVERITY_COLOR[report.severity]}
        explanation={report.explanations.severity}
        ticks={["LOW", "MED", "HIGH", "CRIT"]}
        activeTickIndex={severityIndex}
        delay={0}
      />
      <ScoreCard
        icon={<Gauge className="size-3.5" />}
        title="Priority"
        value={levelToValue(priorityIndex, priorityLevels.length)}
        displayValue={report.priority}
        color={PRIORITY_COLOR[report.priority]}
        explanation={report.explanations.priority}
        ticks={["P4", "P3", "P2", "P1"]}
        activeTickIndex={priorityIndex}
        delay={0.05}
      />
      <ScoreCard
        icon={<ShieldCheck className="size-3.5" />}
        title="Confidence"
        value={report.confidence}
        displayValue={`${report.confidence}%`}
        color="hsl(var(--signal-teal))"
        explanation={report.explanations.confidence}
        delay={0.1}
      />
      <ScoreCard
        icon={<Sparkles className="size-3.5" />}
        title="Bug Quality Score"
        value={report.qualityScore}
        displayValue={`${report.qualityScore}`}
        color="hsl(var(--primary))"
        explanation={report.explanations.qualityScore}
        delay={0.15}
      />
    </div>
  );
}
