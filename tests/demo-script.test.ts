import { describe, expect, it } from "vitest";
import { DEMO_QUESTIONS, buildDemoReport } from "../lib/ai/demo-script";
import { bugReportSchema } from "../lib/schemas";

describe("DEMO_QUESTIONS", () => {
  it("has six scripted questions", () => {
    expect(DEMO_QUESTIONS).toHaveLength(6);
  });
});

describe("buildDemoReport", () => {
  const answers = [
    "A CSV file should download",
    "Nothing happens, no error, no download",
    "Every time, 100% reproducible",
    "Chrome on Windows 11",
    "Affects about 5% of users",
    "No console error",
  ];

  it("produces a report that satisfies the shared BugReport schema", () => {
    const report = buildDemoReport("The export button does nothing when the cart is empty", answers);
    expect(() => bugReportSchema.parse(report)).not.toThrow();
  });

  it("marks it as high severity when failure-related keywords are present", () => {
    const report = buildDemoReport("The export button does nothing when the cart is empty", answers);
    expect(["High", "Critical"]).toContain(report.severity);
  });

  it("detects browser and OS from the environment answer", () => {
    const report = buildDemoReport("Something broke", answers);
    expect(report.environment.browser).toBe("Chrome");
    expect(report.environment.os).toBe("Windows");
  });

  it("falls back to Unknown when nothing is detected", () => {
    const report = buildDemoReport("Something broke", ["", "", "", "", "", ""]);
    expect(report.environment.browser).toBe("Unknown");
  });
});
