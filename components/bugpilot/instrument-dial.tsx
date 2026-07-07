"use client";

import { useEffect, useState } from "react";

const ARC_START = 135; // degrees, bottom-left
const ARC_SWEEP = 270; // degrees, clockwise
const SIZE = 132;
const CENTER = SIZE / 2;
const RADIUS = 48;

function pointOnArc(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.cos(rad),
    y: CENTER + radius * Math.sin(rad),
  };
}

function describeArc(startDeg: number, endDeg: number, radius: number) {
  const start = pointOnArc(startDeg, radius);
  const end = pointOnArc(endDeg, radius);
  const largeArc = endDeg - startDeg <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

interface InstrumentDialProps {
  /** 0-100 position of the needle/fill along the arc. */
  value: number;
  displayValue: string;
  caption: string;
  color: string;
  ticks?: string[];
  activeTickIndex?: number;
}

export function InstrumentDial({
  value,
  displayValue,
  caption,
  color,
  ticks,
  activeTickIndex,
}: InstrumentDialProps) {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setAnimated(value));
    return () => cancelAnimationFrame(raf);
  }, [value]);

  const trackPath = describeArc(ARC_START, ARC_START + ARC_SWEEP, RADIUS);
  const fillEnd = ARC_START + (ARC_SWEEP * Math.min(Math.max(animated, 0), 100)) / 100;
  const fillPath = describeArc(ARC_START, fillEnd, RADIUS);
  const needleAngle = ARC_START + (ARC_SWEEP * value) / 100;
  const needleTip = pointOnArc(needleAngle, RADIUS + 9);
  const needleBase = pointOnArc(needleAngle, RADIUS - 13);

  return (
    <div className="flex flex-col items-center">
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="overflow-visible">
        <path
          d={trackPath}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={7}
          strokeLinecap="round"
        />
        <path
          d={fillPath}
          fill="none"
          stroke={color}
          strokeWidth={7}
          strokeLinecap="round"
          style={{ transition: "d 0.9s cubic-bezier(0.16, 1, 0.3, 1)" }}
        />
        {ticks?.map((tick, i) => {
          const angle = ARC_START + (ARC_SWEEP * i) / (ticks.length - 1);
          const pos = pointOnArc(angle, RADIUS + 20);
          const isActive = i === activeTickIndex;
          return (
            <text
              key={tick}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="7.5"
              fontWeight={isActive ? 700 : 500}
              fill={isActive ? color : "hsl(var(--muted-foreground))"}
              className="font-mono uppercase"
            >
              {tick}
            </text>
          );
        })}
        <line
          x1={needleBase.x}
          y1={needleBase.y}
          x2={needleTip.x}
          y2={needleTip.y}
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          style={{ transition: "all 0.9s cubic-bezier(0.16, 1, 0.3, 1)" }}
        />
        <circle cx={CENTER} cy={CENTER} r={3} fill={color} />
        <text
          x={CENTER}
          y={CENTER + 30}
          textAnchor="middle"
          fontSize="15"
          fontWeight={700}
          fill="hsl(var(--foreground))"
          className="font-mono"
        >
          {displayValue}
        </text>
      </svg>
      <p className="mt-1 text-center text-[11px] leading-snug text-muted-foreground">{caption}</p>
    </div>
  );
}
