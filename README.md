# BugPilot

**Turn one messy sentence into a bug report worth reading.**

BugPilot replaces the bug-report form with a conversation. Describe what went wrong in one sentence, an AI interviewer asks a handful of sharp follow-up questions, and it writes up a structured, scored bug report at the end.

No database. No auth. No Docker. Works with **zero setup** in Demo mode, or plug in Claude, Gemini, or a local Ollama model for a real AI interviewer.

---

## What it does

1. **Describe** : one sentence, in a textarea.
2. **Interview** : one focused question at a time, adapting to your answers, until there's enough to work with.
3. **Report** : title, summary, steps to reproduce, expected/actual behaviour, environment, severity, priority, notes.
4. **Score** : four cockpit-style dials: **Severity**, **Priority**, **Confidence**, **Bug Quality Score**, each with a one-line explanation.
5. **Edit** : every field is editable before you do anything with it.
6. **Export** : copy as clean **Markdown** or a ready-to-paste **Jira-shaped JSON** payload.

## Four ways to run the interview

Pick one from the settings panel on the start screen (⚙ AI provider), or set `AI_PROVIDER` on the server. Nothing is required to just try the app, **Demo is the default.**

| Provider | Cost | Setup | Notes |
|---|---|---|---|
| **Demo** | Free forever | None | Scripted 6-question interview, no network calls, generates a coherent sample report. Perfect for recruiters checking out the repo. |
| **Gemini** | Free tier | An API key | Google AI Studio gives free, no-credit-card API access to Gemini Flash models. |
| **Claude** | Paid | An API key | The best interviewer, most natural, most adaptive questions. |
| **Ollama** | Free | Install locally | Runs entirely on your machine. Quality depends on the local model; tool-calling is less reliable than the cloud options. |

### BYOK (Bring Your Own Key)

Every key is **typed into the browser, saved only in that browser's `localStorage`, and sent to the server only as a header on the active request**, never persisted server-side, never logged. This means BugPilot can be deployed publicly (e.g. on Vercel) without the owner paying for anyone else's usage: each visitor pastes their own key.

### Getting a free Gemini key

1. Go to [aistudio.google.com/apikey](https://aistudio.google.com/apikey).
2. Sign in with a Google account, click **Create API key**.
3. Paste it into the settings panel (or set `GEMINI_API_KEY` in `.env.local`).

### Getting a Claude key

1. [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys) → **Create Key**.
2. Paste it into the settings panel (or set `ANTHROPIC_API_KEY`).

### Setting up Ollama (free, local)

1. Install Ollama: [ollama.com/download](https://ollama.com/download).
2. Pull a tool-calling-capable model:
   ```bash
   ollama pull llama3.2
   # or: ollama pull qwen2.5
   ```
3. Make sure it's running: `ollama serve` (usually already running after install).
4. In the settings panel, pick **Ollama**. Default URL is `http://localhost:11434`, default model `llama3.2`, both editable in the UI.

If Ollama isn't reachable, or the chosen model isn't pulled yet, BugPilot shows a friendly inline message telling you exactly what to do (`ollama pull ...`) instead of crashing.

## Screenshots

> _Add your own screenshots here before publishing, placeholders below._

| Describe | Interview | Report & scores |
|---|---|---|
| `docs/screenshot-start.png` | `docs/screenshot-interview.png` | `docs/screenshot-report.png` |

## Tech stack

| Layer | Choice |
|---|---|
| Framework | [Next.js 15](https://nextjs.org) (App Router) |
| Language | TypeScript |
| Styling | [Tailwind CSS](https://tailwindcss.com) |
| Components | [shadcn/ui](https://ui.shadcn.com) primitives (owned in `components/ui`) |
| AI orchestration | [Vercel AI SDK](https://sdk.vercel.ai) (`ai`, `@ai-sdk/anthropic`, `@ai-sdk/google`, `@ai-sdk/openai`) |
| Models | Claude (`claude-sonnet-5`), Gemini (`gemini-2.5-flash`), Ollama (`llama3.2`), or the built-in Demo script |
| Forms & validation | React Hook Form + Zod |
| Motion | Framer Motion (page transitions, typing indicator, score dials sweeping in) |

## Getting started

```bash
git clone https://github.com/<your-username>/bugpilot.git
cd bugpilot
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), it works immediately in **Demo mode**, no `.env` needed.

To use a real provider, either:
- open the ⚙ settings panel in the app and paste a key (BYOK), or
- `cp .env.example .env.local` and fill in a key there as the server-side default.

## Environment variables

All optional, everything also works from the in-app settings panel.

| Variable | Provider | Default |
|---|---|---|
| `AI_PROVIDER` | — | `demo` |
| `ANTHROPIC_API_KEY` / `ANTHROPIC_MODEL` | Claude | — / `claude-sonnet-5` |
| `GEMINI_API_KEY` / `GEMINI_MODEL` | Gemini | — / `gemini-2.5-flash` |
| `OLLAMA_BASE_URL` / `OLLAMA_MODEL` | Ollama | `http://localhost:11434` / `llama3.2` |

## Project structure

```
bugpilot/
├─ app/
│  ├─ api/interview/route.ts     # resolves the provider, streams the interview
│  ├─ layout.tsx
│  ├─ page.tsx                   # start → interview → report state machine
│  └─ globals.css
├─ components/
│  ├─ ui/                        # shadcn/ui primitives
│  └─ bugpilot/                  # start screen, chat, score dials, settings panel…
├─ hooks/
│  ├─ use-interview.ts           # wraps useChat, sends BYOK headers, surfaces errors
│  └─ use-ai-config.ts           # localStorage-backed provider settings
├─ lib/
│  ├─ ai/
│  │  ├─ types.ts                # AIProvider interface, AIProviderError
│  │  ├─ catalog.ts               # shared provider metadata (labels, defaults)
│  │  ├─ resolver.ts              # picks a provider, returns a ready LanguageModel
│  │  ├─ demo-script.ts           # Demo mode's scripted questions + report builder
│  │  └─ providers/
│  │     ├─ claude.ts
│  │     ├─ gemini.ts
│  │     ├─ ollama.ts             # includes a friendly local health-check
│  │     └─ demo.ts               # MockLanguageModelV1-backed, no network at all
│  ├─ ai-client-config.ts        # localStorage read/write, header builder
│  ├─ schemas.ts                  # the single Zod schema shared by tool + edit form
│  ├─ prompts.ts
│  ├─ export.ts                   # BugReport → Markdown / Jira-shaped JSON
│  ├─ types.ts
│  └─ utils.ts
└─ .env.example
```

## How each provider plugs in

Every provider (`lib/ai/providers/*.ts`) implements the same shape:

```ts
interface AIProvider {
  id: AiProviderId;
  label: string;
  requiresApiKey: boolean;
  requiresBaseUrl: boolean;
  defaultModel: string;
  createModel(config: AIProviderConfig): Promise<LanguageModel>;
}
```

`lib/ai/resolver.ts` picks one (per-request header override, else `AI_PROVIDER` env var, else Demo) and hands the resulting `LanguageModel` straight to `streamText` in `app/api/interview/route.ts`, the rest of the app (the chat UI, the tool-call detection, the report/score/edit/export screens) never needs to know which provider is behind it.

Demo mode plugs into the exact same pipeline: it's a `MockLanguageModelV1` whose `doStream` reads how many answers have been given so far and either streams back the next scripted question or, once done, streams a `tool-call` part containing a fully-formed `BugReport`, the same tool-call shape a real model would produce. No parallel code path, no special-casing on the client.

## How the interview actually ends

No hardcoded question count for the real providers. The system prompt (`lib/prompts.ts`) tells the model to ask exactly one question per turn and call a `completeInterview` tool — whose parameters are the full bug report schema, the moment it has enough information. The frontend watches the stream for that tool call and jumps straight to the score dashboard.

## Future improvements

- Real Jira/Linear integration (the JSON export already mirrors Jira's field shape).
- Session history, keep past reports around instead of one-at-a-time.
- Attach screenshots/console logs and let the model read them as part of the interview.
- Team presets (custom severity/priority rubrics per project).
- Shareable read-only report links.
- Voice input for the initial one-sentence description.

## License

MIT — do whatever you'd like with it.
