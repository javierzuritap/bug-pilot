import { z } from "zod";

export const severityLevels = ["Low", "Medium", "High", "Critical"] as const;
export const priorityLevels = ["P4", "P3", "P2", "P1"] as const;

export const environmentSchema = z.object({
  browser: z.string().describe("Browser and version, e.g. 'Chrome 126'. Use 'Unknown' if never mentioned."),
  os: z.string().describe("Operating system, e.g. 'macOS 15'. Use 'Unknown' if never mentioned."),
  device: z.string().describe("Device or platform, e.g. 'Desktop', 'iPhone 15'. Use 'Unknown' if never mentioned."),
  appVersion: z
    .string()
    .describe("App / product version or URL if relevant. Use 'Unknown' if never mentioned."),
});

export const explanationsSchema = z.object({
  severity: z.string().describe("One short sentence justifying the severity rating."),
  priority: z.string().describe("One short sentence justifying the priority rating."),
  confidence: z
    .string()
    .describe("One short sentence on how confident BugPilot is in this report, and why."),
  qualityScore: z
    .string()
    .describe("One short sentence on what is strong or missing in the report."),
});

export const bugReportSchema = z.object({
  title: z.string().describe("A short, specific bug title (max ~12 words)."),
  summary: z.string().describe("A two or three sentence summary of the bug."),
  stepsToReproduce: z
    .array(z.string())
    .min(1)
    .describe("Ordered, numbered-friendly steps to reproduce the bug."),
  expectedBehaviour: z.string().describe("What the user expected to happen."),
  actualBehaviour: z.string().describe("What actually happened instead."),
  environment: environmentSchema,
  severity: z.enum(severityLevels),
  priority: z.enum(priorityLevels),
  confidence: z.number().min(0).max(100).describe("0-100. How complete/reliable the gathered info is."),
  qualityScore: z.number().min(0).max(100).describe("0-100. Overall quality of the report as written."),
  additionalNotes: z.string().optional().describe("Anything else worth noting, or an empty string."),
  explanations: explanationsSchema,
});

export type BugReport = z.infer<typeof bugReportSchema>;
export type Environment = z.infer<typeof environmentSchema>;
export type Explanations = z.infer<typeof explanationsSchema>;

/** Tool name the model calls once it has enough information to write the report. */
export const COMPLETE_INTERVIEW_TOOL = "completeInterview";
