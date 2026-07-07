import { describe, expect, it } from "vitest";
import { reportToMarkdown, reportToJiraJson } from "../lib/export";
import type { BugReport } from "../lib/schemas";

const sampleReport: BugReport = {
  title: "Export button does nothing when cart is empty",
  summary: "Clicking export with an empty cart produces no file and no error.",
  stepsToReproduce: ["Empty the cart", "Click export", "Observe nothing happens"],
  expectedBehaviour: "A CSV file should download",
  actualBehaviour: "Nothing happens, no error, no download",
  environment: { browser: "Chrome", os: "Windows", device: "Desktop", appVersion: "Unknown" },
  severity: "High",
  priority: "P1",
  confidence: 90,
  qualityScore: 88,
  additionalNotes: "Started after the last deploy.",
  explanations: {
    severity: "Blocks a core feature for affected users.",
    priority: "Reproduces every time.",
    confidence: "All key fields were answered clearly.",
    qualityScore: "Report is complete and specific.",
  },
};

describe("reportToMarkdown", () => {
  it("includes the title as an H1", () => {
    expect(reportToMarkdown(sampleReport)).toContain("# Export button does nothing when cart is empty");
  });

  it("numbers every reproduction step", () => {
    const md = reportToMarkdown(sampleReport);
    expect(md).toContain("1. Empty the cart");
    expect(md).toContain("2. Click export");
    expect(md).toContain("3. Observe nothing happens");
  });

  it("includes severity, priority, confidence and quality score", () => {
    const md = reportToMarkdown(sampleReport);
    expect(md).toContain("High");
    expect(md).toContain("P1");
    expect(md).toContain("90%");
    expect(md).toContain("88/100");
  });
});

describe("reportToJiraJson", () => {
  it("maps priority to a plain Pn label", () => {
    const json = reportToJiraJson(sampleReport);
    expect(json.fields.priority).toEqual({ name: "P1" });
  });

  it("sets the issue type to Bug", () => {
    const json = reportToJiraJson(sampleReport);
    expect(json.fields.issuetype).toEqual({ name: "Bug" });
  });

  it("includes the environment as structured data", () => {
    const json = reportToJiraJson(sampleReport);
    expect(json.fields.customfield_environment).toEqual(sampleReport.environment);
  });
});
