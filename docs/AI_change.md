# AI Provider Change Guide

This document explains exactly how the AI integration works in this codebase and what you need to change if you want to switch to a different AI provider.

---

## How the AI integration is structured

The AI feature auto-populates AEO/GEO fields (Quick Answer, Key Takeaways, FAQs, Hard Facts) in the admin blog and project editors. It runs entirely server-side — the API key is never exposed to the browser.

Three files are involved:

```
.env.local                  → API key(s)
src/ai/genkit.ts            → Provider plugin + model name
src/lib/ai-actions.ts       → Prompts, retry logic, response parsing
```

### File responsibilities

**`.env.local`**
Holds the API key. The Genkit plugin reads it automatically from the environment by convention (e.g. `GOOGLE_GENAI_API_KEY` for Google, `OPENAI_API_KEY` for OpenAI). You never pass the key manually in code.

**`src/ai/genkit.ts`**
Initialises the Genkit instance with the provider plugin and default model. Currently:
```ts
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
});
```

**`src/lib/ai-actions.ts`**
Contains everything else:
- `buildBlogPrompt()` — the prompt sent when "Auto-fill with AI" is clicked in the blog editor
- `buildProjectPrompt()` — the prompt sent in the project editor
- `callWithRetry()` — calls the model with automatic retry and fallback on 503/429 errors
- `parseResult()` — strips markdown fences and parses the JSON response
- `classifyError()` — converts raw API errors into readable user messages
- `generateAeoGeoFields()` — exported server action for blog
- `generateAeoGeoFieldsForProject()` — exported server action for projects

The prompts and parsing logic are **provider-agnostic** — they work with any model that can follow instructions and return JSON. Only the model call in `callWithRetry()` is provider-specific.

---

## Current provider: Google AI (Gemini)

| Setting | Value |
|---|---|
| Provider | Google AI Studio |
| Primary model | `gemini-2.5-flash` |
| Fallback model | `gemini-2.0-flash` (used automatically on 503) |
| Free tier | 15 req/min, 1,500 req/day — no credit card required |
| Key env var | `GOOGLE_GENAI_API_KEY` |
| Get a key | https://aistudio.google.com/apikey |
| Genkit plugin | `@genkit-ai/google-genai` (already installed) |

---

## Switching to a different provider

### What always changes

1. The API key in `.env.local`
2. The plugin import and model name in `src/ai/genkit.ts`
3. The npm package (if the new provider needs a different Genkit plugin)

### What never changes

- The prompts in `buildBlogPrompt()` and `buildProjectPrompt()`
- The `parseResult()` function
- The `classifyError()` function
- The exported server actions (`generateAeoGeoFields`, `generateAeoGeoFieldsForProject`)
- All admin editor components

---

## Provider-by-provider instructions

### Option 1 — OpenAI (GPT-4o mini) — Freemium

GPT-4o mini is the cheapest OpenAI model. There is no free tier — requires a credit card and pay-as-you-go billing. Very cheap at ~$0.15/1M input tokens.

**Step 1 — Install the plugin:**
```bash
npm install genkitx-openai
```

**Step 2 — `.env.local`:**
```
OPENAI_API_KEY=sk-proj-...
```
Remove or comment out `GOOGLE_GENAI_API_KEY`.

**Step 3 — `src/ai/genkit.ts`:**
```ts
import { genkit } from 'genkit';
import { openAI } from 'genkitx-openai';

const aiPrimary = genkit({
  plugins: [openAI()],
  model: 'openai/gpt-4o-mini',
});

const aiFallback = genkit({
  plugins: [openAI()],
  model: 'openai/gpt-4o-mini', // same model, retry handles backoff
});

export { aiPrimary, aiFallback };
```

**Step 4 — `src/lib/ai-actions.ts`:**
Change the import at the top from:
```ts
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
const aiPrimary = genkit({ plugins: [googleAI()], model: 'googleai/gemini-2.5-flash' });
const aiFallback = genkit({ plugins: [googleAI()], model: 'googleai/gemini-2.0-flash' });
```
To:
```ts
import { genkit } from 'genkit';
import { openAI } from 'genkitx-openai';
const aiPrimary = genkit({ plugins: [openAI()], model: 'openai/gpt-4o-mini' });
const aiFallback = aiPrimary; // no separate fallback needed
```

Everything else in `ai-actions.ts` stays identical.

---

### Option 2 — Anthropic (Claude 3 Haiku) — Freemium

Claude Haiku is Anthropic's fastest and cheapest model. No free tier — requires billing. Very capable at structured JSON output.

**Step 1 — Install the plugin:**
```bash
npm install genkitx-anthropic
```

**Step 2 — `.env.local`:**
```
ANTHROPIC_API_KEY=sk-ant-...
```

**Step 3 — `src/ai/genkit.ts`:**
```ts
import { genkit } from 'genkit';
import { anthropic } from 'genkitx-anthropic';

const aiPrimary = genkit({
  plugins: [anthropic()],
  model: 'anthropic/claude-3-haiku',
});

export { aiPrimary };
```

**Step 4 — `src/lib/ai-actions.ts`:**
Same swap as OpenAI — replace the plugin import and model strings at the top. Prompts and parsing unchanged.

---

### Option 3 — Groq (Llama 3.1 70B) — Free tier available

Groq offers a genuinely free tier with fast inference. No Genkit plugin exists, so you bypass Genkit entirely and call the REST API directly.

**Step 1 — No new npm package needed.**

**Step 2 — `.env.local`:**
```
GROQ_API_KEY=gsk_...
```
Get a free key at https://console.groq.com

**Step 3 — `src/ai/genkit.ts`:**
This file is no longer needed. You can delete it or leave it unused.

**Step 4 — `src/lib/ai-actions.ts`:**
Replace the `callWithRetry()` function with a direct fetch:

```ts
async function callWithRetry(prompt: string): Promise<string> {
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.1-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`${res.status}: ${err}`);
      }

      const data = await res.json();
      return data.choices[0].message.content;
    } catch (err) {
      if (attempt === maxAttempts) throw err;
      await new Promise(r => setTimeout(r, attempt * 1500));
    }
  }
  throw new Error('All retry attempts exhausted');
}
```

The prompts, `parseResult()`, `classifyError()`, and exported actions all stay identical.

---

### Option 4 — Stay on Google but switch model

If you just want to use a different Gemini model (e.g. `gemini-2.5-pro` for higher quality, or `gemini-2.0-flash-lite` for faster/cheaper), only change `src/ai/genkit.ts`:

```ts
// Higher quality (slower, uses more quota):
model: 'googleai/gemini-2.5-pro'

// Faster and cheaper (good for high volume):
model: 'googleai/gemini-2.0-flash-lite'

// Current default (best balance):
model: 'googleai/gemini-2.5-flash'
```

No other files need to change.

---

## Summary table

| Provider | Key env var | Plugin package | `genkit.ts` change | `ai-actions.ts` change | Free tier |
|---|---|---|---|---|---|
| Google Gemini (current) | `GOOGLE_GENAI_API_KEY` | `@genkit-ai/google-genai` (installed) | ✅ already set | ❌ none | ✅ 1,500 req/day |
| OpenAI GPT-4o mini | `OPENAI_API_KEY` | `genkitx-openai` | ✅ swap plugin + model | ✅ swap import only | ❌ paid only |
| Anthropic Claude Haiku | `ANTHROPIC_API_KEY` | `genkitx-anthropic` | ✅ swap plugin + model | ✅ swap import only | ❌ paid only |
| Groq Llama 3.1 70B | `GROQ_API_KEY` | none needed | ❌ not used | ✅ replace `callWithRetry` | ✅ free tier |
| Different Gemini model | `GOOGLE_GENAI_API_KEY` | already installed | ✅ change model string | ❌ none | ✅ varies by model |

---

## Where the prompts live

Both prompts are in `src/lib/ai-actions.ts`:

- `buildBlogPrompt()` — used by the blog editor "Auto-fill with AI" button
- `buildProjectPrompt()` — used by the project editor "Auto-fill with AI" button

You can edit the prompt text in those functions at any time to change what the AI generates, how it formats the output, or what rules it follows. The prompts are plain strings — no special syntax required.

---

## Important notes

- The API key must **never** have a `NEXT_PUBLIC_` prefix. Server actions run on the server — the key stays private.
- If you add a new env var key name, restart the dev server (`npm run dev`) to pick it up.
- The `SESSION_SECRET` in `.env.local` is unrelated to AI — it's used for admin session cookies.
- Genkit plugins read their API keys by convention from the environment. You do not pass the key manually in code.
