"use client";

import { cn } from "@/lib/utils";
import type { Stage } from "@/lib/types";

const STAGES: { key: Stage; label: string }[] = [
  { key: "start", label: "Describe" },
  { key: "interview", label: "Interview" },
  { key: "report", label: "Report" },
];

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="shrink-0">
        <circle cx="12" cy="12" r="9.25" stroke="hsl(var(--primary))" strokeWidth="1.5" />
        <path
          d="M12 3.5v3M12 17.5v3M3.5 12h3M17.5 12h3"
          stroke="hsl(var(--primary))"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M8 13.5 12 8l4 5.5-4 2.5-4-2.5Z"
          fill="hsl(var(--accent))"
          stroke="hsl(var(--accent))"
          strokeWidth="0.5"
        />
      </svg>
      <span className="text-sm font-semibold tracking-tight text-foreground">BugPilot</span>
    </div>
  );
}

export function AppShell({ stage, children }: { stage: Stage; children: React.ReactNode }) {
  const activeIndex = STAGES.findIndex((s) => s.key === stage);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="container flex h-14 items-center justify-between">
          <Logo />
          <nav className="hidden items-center gap-3 sm:flex">
            {STAGES.map((s, i) => (
              <div key={s.key} className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex items-center gap-1.5 text-xs font-medium transition-colors",
                    i === activeIndex
                      ? "text-foreground"
                      : i < activeIndex
                        ? "text-signal-teal"
                        : "text-muted-foreground/50"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded-full border text-[10px]",
                      i === activeIndex
                        ? "border-primary text-primary"
                        : i < activeIndex
                          ? "border-signal-teal text-signal-teal"
                          : "border-border text-muted-foreground/50"
                    )}
                  >
                    {i + 1}
                  </span>
                  {s.label}
                </span>
                {i < STAGES.length - 1 && <span className="h-px w-6 bg-border" />}
              </div>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
