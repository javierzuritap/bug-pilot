import { describe, expect, it } from "vitest";
import { bugReportSchema, severityLevels, priorityLevels } from "../lib/schemas";

const validReport = {
  title: "Sample bug",
  summary: "Something went wrong.",
  stepsToReproduce: ["Do X", "Do Y"],
  expectedBehaviour: "X should happen",
  actualBehaviour: "Y happens instead",
  environment: { browser: "Chrome", os: "macOS", device: "Desktop", appVersion: "1.0.0" },
  severity: "Medium",
  priority: "P3",
  confidence: 80,
  qualityScore: 75,
  additionalNotes: "",
  explanations: {
    severity: "Some users affected.",
    priority: "Not urgent.",
    confidence: "Enough detail was provided.",
    qualityScore: "All fields are filled.",
  },
};

describe("bugReportSchema", () => {
  it("accepts a well-formed report", () => {
    expect(() => bugReportSchema.parse(validReport)).not.toThrow();
  });

  it("rejects an empty stepsToReproduce array", () => {
    expect(() => bugReportSchema.parse({ ...validReport, stepsToReproduce: [] })).toThrow();
  });

  it("rejects a severity outside the known levels", () => {
    expect(() => bugReportSchema.parse({ ...validReport, severity: "Catastrophic" })).toThrow();
  });

  it("rejects a confidence value above 100", () => {
    expect(() => bugReportSchema.parse({ ...validReport, confidence: 150 })).toThrow();
  });

  it("exposes exactly four severity levels and four priority levels", () => {
    expect(severityLevels).toHaveLength(4);
    expect(priorityLevels).toHaveLength(4);
  });
});
