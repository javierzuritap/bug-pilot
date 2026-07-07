import { severityLevels, priorityLevels, type BugReport } from "@/lib/schemas";

export const DEMO_QUESTIONS = [
  "Got it — what were you expecting to happen at that point?",
  "And what happened instead?",
  "Does this happen every time, or only sometimes?",
  "Which browser and operating system were you on?",
  "Roughly how many users or how often does this come up?",
  "Anything else worth mentioning — an error message, when it started, anything unusual?",
];

const CRITICAL_WORDS = ["crash", "data loss", "security", "payment", "can't log in", "cannot log in", "breach"];
const HIGH_WORDS = ["broken", "blocks", "block", "major", "fails", "failure", "error"];
const LOW_WORDS = ["cosmetic", "minor", "small", "typo", "slightly", "barely"];
const ALWAYS_WORDS = ["always", "every time", "consistently", "100%"];
const RARE_WORDS = ["sometimes", "rare", "occasionally", "intermittent"];

const BROWSERS = ["chrome", "firefox", "safari", "edge", "brave", "opera"];
const OSES = ["windows", "macos", "mac os", "linux", "ios", "android"];

function scoreKeywords(text: string, words: string[]) {
  const lower = text.toLowerCase();
  return words.reduce((count, word) => count + (lower.includes(word) ? 1 : 0), 0);
}

function detectFromList(text: string, list: string[]) {
  const lower = text.toLowerCase();
  const hit = list.find((item) => lower.includes(item));
  return hit ? hit.replace(/\b\w/g, (c) => c.toUpperCase()) : "Unknown";
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function toTitle(description: string) {
  const trimmed = description.trim().replace(/\.$/, "");
  const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  return capitalized.length > 80 ? `${capitalized.slice(0, 77)}...` : capitalized;
}

export function buildDemoReport(description: string, answers: string[]): BugReport {
  const [expected = "Unknown", actual = "Unknown", frequency = "Unknown", environment = "Unknown", impact = "", notes = ""] =
    answers;

  const combinedText = [description, expected, actual, frequency, impact, notes].join(" ");

  const criticalScore = scoreKeywords(combinedText, CRITICAL_WORDS);
  const highScore = scoreKeywords(combinedText, HIGH_WORDS);
  const lowScore = scoreKeywords(combinedText, LOW_WORDS);

  let severity: BugReport["severity"] = "Medium";
  if (criticalScore > 0) severity = "Critical";
  else if (highScore > 0) severity = "High";
  else if (lowScore > 0) severity = "Low";

  const isFrequent = scoreKeywords(frequency, ALWAYS_WORDS) > 0;
  const isRare = scoreKeywords(frequency, RARE_WORDS) > 0;

  const severityIndex = severityLevels.indexOf(severity);
  let priorityIndex = clamp(severityIndex + (isFrequent ? 1 : isRare ? -1 : 0), 0, priorityLevels.length - 1);
  const priority = priorityLevels[priorityIndex];

  const answeredWords = answers.filter(Boolean).join(" ").split(/\s+/).filter(Boolean).length;
  const confidence = clamp(45 + answeredWords * 2, 45, 92);
  const qualityScore = clamp(50 + answeredWords * 2 - (environment === "Unknown" ? 5 : 0), 50, 95);

  return {
    title: toTitle(description),
    summary: `${toTitle(description)}. ${expected !== "Unknown" ? `Expected: ${expected}.` : ""} ${
      actual !== "Unknown" ? `Actual: ${actual}.` : ""
    }`.trim(),
    stepsToReproduce: [
      "Open the affected page or feature described below.",
      description,
      isFrequent ? "Repeat the same action — it reproduces every time." : "Repeat the same action a few times.",
    ],
    expectedBehaviour: expected,
    actualBehaviour: actual || description,
    environment: {
      browser: detectFromList(environment, BROWSERS),
      os: detectFromList(environment, OSES),
      device: /mobile|iphone|android|tablet/i.test(environment) ? "Mobile" : "Desktop",
      appVersion: "Unknown",
    },
    severity,
    priority,
    confidence,
    qualityScore,
    additionalNotes: [impact, notes, "(Generated in Demo mode — no AI model was called.)"]
      .filter(Boolean)
      .join(" "),
    explanations: {
      severity: `Based on the language used (${severity.toLowerCase()}-impact keywords detected), this looks like a ${severity.toLowerCase()} severity issue.`,
      priority: `Given the severity and how often it occurs (${frequency || "frequency not specified"}), ${priority} feels right.`,
      confidence: `Estimated from how much detail was provided across your answers — this is a rule-based demo estimate, not a real AI analysis.`,
      qualityScore: `Reflects how many of the standard fields (repro steps, expected/actual, environment) were filled in during this scripted demo.`,
    },
  };
}
