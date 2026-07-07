"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppShell } from "@/components/bugpilot/app-shell";
import { StartScreen } from "@/components/bugpilot/start-screen";
import { ChatInterview } from "@/components/bugpilot/chat-interview";
import { ReportStage } from "@/components/bugpilot/report-stage";
import type { Stage } from "@/lib/types";
import type { BugReport } from "@/lib/schemas";

export default function Home() {
  const [stage, setStage] = useState<Stage>("start");
  const [description, setDescription] = useState("");
  const [report, setReport] = useState<BugReport | null>(null);

  function handleStart(value: string) {
    setDescription(value);
    setStage("interview");
  }

  function handleInterviewComplete(finishedReport: BugReport) {
    setReport(finishedReport);
    setStage("report");
  }

  function handleRestart() {
    setDescription("");
    setReport(null);
    setStage("start");
  }

  return (
    <AppShell stage={stage}>
      <AnimatePresence mode="wait">
        {stage === "start" && (
          <motion.div key="start" exit={{ opacity: 0 }} className="flex flex-1 flex-col">
            <StartScreen onStart={handleStart} />
          </motion.div>
        )}

        {stage === "interview" && (
          <motion.div
            key="interview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-1 flex-col"
          >
            <ChatInterview initialDescription={description} onComplete={handleInterviewComplete} />
          </motion.div>
        )}

        {stage === "report" && report && (
          <motion.div
            key="report"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-1 flex-col"
          >
            <ReportStage initialReport={report} onRestart={handleRestart} />
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
