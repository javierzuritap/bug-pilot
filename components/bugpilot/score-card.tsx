"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InstrumentDial } from "@/components/bugpilot/instrument-dial";

interface ScoreCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  displayValue: string;
  color: string;
  explanation: string;
  ticks?: string[];
  activeTickIndex?: number;
  delay?: number;
}

export function ScoreCard({
  icon,
  title,
  value,
  displayValue,
  color,
  explanation,
  ticks,
  activeTickIndex,
  delay = 0,
}: ScoreCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: "easeOut" }}
    >
      <Card className="h-full">
        <CardHeader className="flex-row items-center gap-2 pb-2">
          <span className="text-muted-foreground">{icon}</span>
          <CardTitle className="text-xs uppercase tracking-wide text-muted-foreground">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center pt-1">
          <InstrumentDial
            value={value}
            displayValue={displayValue}
            caption=""
            color={color}
            ticks={ticks}
            activeTickIndex={activeTickIndex}
          />
          <p className="mt-2 text-center text-xs leading-relaxed text-muted-foreground">
            {explanation}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
