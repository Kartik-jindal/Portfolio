'use server';

/**
 * AI Server Actions — Genkit + Gemini
 *
 * Auto-populates AEO/GEO fields (Quick Answer, Key Takeaways, FAQs, Hard Facts)
 * from blog post or project content.
 *
 * Model cascade: tries gemini-2.5-flash first, falls back to gemini-2.0-flash
 * on 503 (high demand). Retries up to 3 times with exponential backoff.
 *
 * Runs server-side only — the API key is never exposed to the browser.
 */

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// Two model instances — primary and fallback
const aiPrimary = genkit({ plugins: [googleAI()], model: 'googleai/gemini-2.5-flash' });
const aiFallback = genkit({ plugins: [googleAI()], model: 'googleai/gemini-2.0-flash' });

interface AeoGeoResult {
    quickAnswer: string;
    takeaways: string[];
    faqs: { q: string; a: string }[];
    facts: string[];
}

/** Strip HTML tags and collapse whitespace for clean model input. */
function stripHtml(html: string): string {
    return html
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/\s+/g, ' ')
        .trim();
}

/** Parse the model's JSON response, stripping any accidental markdown fences. */
function parseResult(text: string): AeoGeoResult {
    const cleaned = text
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```\s*$/i, '')
        .trim();
    const parsed = JSON.parse(cleaned) as AeoGeoResult;
    return {
        quickAnswer: (parsed.quickAnswer || '').slice(0, 250),
        takeaways: Array.isArray(parsed.takeaways) ? parsed.takeaways.slice(0, 5) : [],
        faqs: Array.isArray(parsed.faqs) ? parsed.faqs.slice(0, 4) : [],
        facts: Array.isArray(parsed.facts) ? parsed.facts.slice(0, 4) : [],
    };
}

/** Sleep for ms milliseconds. */
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

/**
 * Call the model with automatic retry + fallback.
 * - Retries up to 3 times on 503 (high demand) with exponential backoff.
 * - Falls back to gemini-2.0-flash after the first 503.
 */
async function callWithRetry(prompt: string): Promise<string> {
    const maxAttempts = 3;
    let useFallback = false;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const instance = useFallback ? aiFallback : aiPrimary;
            const { text } = await instance.generate({ prompt });
            return text;
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            const is503 = msg.includes('503') || msg.includes('UNAVAILABLE') || msg.includes('high demand');
            const is429 = msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED');

            if (attempt === maxAttempts) throw err; // exhausted all retries

            if (is503) {
                // Switch to fallback model and wait before retrying
                useFallback = true;
                const delay = attempt * 1500; // 1.5s, 3s
                console.warn(`[AI] 503 on attempt ${attempt}, switching to fallback model, retrying in ${delay}ms`);
                await sleep(delay);
            } else if (is429) {
                // Rate limit — wait longer
                const delay = attempt * 3000; // 3s, 6s
                console.warn(`[AI] 429 rate limit on attempt ${attempt}, retrying in ${delay}ms`);
                await sleep(delay);
            } else {
                throw err; // non-retryable error
            }
        }
    }
    throw new Error('All retry attempts exhausted');
}

/** Classify errors into user-friendly messages. */
function classifyError(err: unknown): string {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('401') || msg.includes('403') || msg.includes('API_KEY'))
        return 'Invalid or missing GOOGLE_GENAI_API_KEY. Get a free key at aistudio.google.com.';
    if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED'))
        return 'Rate limit hit. Wait a moment and try again (free tier: 15 req/min).';
    if (msg.includes('503') || msg.includes('UNAVAILABLE'))
        return 'Google AI is under high demand. Please try again in a few seconds.';
    return `AI generation failed: ${msg}`;
}

// ── PROMPTS ───────────────────────────────────────────────────────────────────

/**
 * BLOG PROMPT
 * Sent when "Auto-fill with AI" is clicked in the blog editor.
 * Input: title, categories, summary, article body (HTML-stripped, max 6000 chars)
 * Output JSON: { quickAnswer, takeaways[], faqs[], facts[] }
 */
function buildBlogPrompt(title: string, categories: string[], summary: string, content: string): string {
    const truncated = content.length > 6000 ? content.slice(0, 6000) + '...' : content;
    return `You are an SEO and Answer Engine Optimization (AEO) specialist. Analyze the following blog post and generate structured metadata to improve its visibility in AI-powered search engines, featured snippets, and generative AI answers.

BLOG POST:
Title: ${title}
Categories: ${categories.join(', ')}
Summary: ${summary}
Content: ${truncated}

Generate the following in valid JSON format (no markdown, no code fences, just raw JSON):
{
  "quickAnswer": "A single concise sentence (max 200 chars) that directly answers what this post is about — optimized for AI snippet extraction",
  "takeaways": ["3-5 high-signal bullet points summarizing the key insights from this post"],
  "faqs": [
    {"q": "A natural question a reader might ask", "a": "A direct, factual answer based on the post content"},
    {"q": "Another relevant question", "a": "Another direct answer"}
  ],
  "facts": ["2-4 specific, verifiable data points or claims from the post (e.g. percentages, metrics, named technologies)"]
}

Rules:
- quickAnswer must be under 200 characters
- takeaways: 3-5 items, each under 120 characters
- faqs: 2-4 Q&A pairs, answers under 200 characters each
- facts: 2-4 items, each a specific factual claim
- All content must be derived from the post — do not invent information
- Write in the same language as the post content`;
}

/**
 * PROJECT PROMPT
 * Sent when "Auto-fill with AI" is clicked in the project editor.
 * Input: title, role, tech stack, desc, case study (HTML-stripped, max 6000 chars)
 * Output JSON: { quickAnswer, takeaways[], faqs[], facts[] }
 */
function buildProjectPrompt(title: string, role: string, tech: string[], desc: string, longDesc: string): string {
    const truncated = longDesc.length > 6000 ? longDesc.slice(0, 6000) + '...' : longDesc;
    return `You are an SEO and Answer Engine Optimization (AEO) specialist. Analyze the following software project and generate structured metadata to improve its visibility in AI-powered search engines, featured snippets, and generative AI answers.

PROJECT:
Title: ${title}
Role: ${role}
Tech Stack: ${tech.join(', ')}
Description: ${desc}
Case Study: ${truncated}

Generate the following in valid JSON format (no markdown, no code fences, just raw JSON):
{
  "quickAnswer": "A single concise sentence (max 200 chars) that directly answers what this project is and what it achieves — optimized for AI snippet extraction",
  "takeaways": ["3-5 high-signal bullet points about the project's technical achievements or impact"],
  "faqs": [
    {"q": "A natural question someone might ask about this project", "a": "A direct, factual answer based on the project content"},
    {"q": "Another relevant question", "a": "Another direct answer"}
  ],
  "facts": ["2-4 specific, verifiable technical facts or metrics from the project (e.g. technologies used, performance gains, scale)"]
}

Rules:
- quickAnswer must be under 200 characters
- takeaways: 3-5 items, each under 120 characters
- faqs: 2-4 Q&A pairs, answers under 200 characters each
- facts: 2-4 items, each a specific factual claim
- All content must be derived from the project — do not invent information
- Write in the same language as the project content`;
}

// ── EXPORTED ACTIONS ──────────────────────────────────────────────────────────

/**
 * Generate AEO/GEO fields from blog post content.
 * Uses the BLOG PROMPT above.
 */
export async function generateAeoGeoFields(
    title: string,
    summary: string,
    content: string,
    categories: string[],
): Promise<AeoGeoResult> {
    const prompt = buildBlogPrompt(title, categories, summary, stripHtml(content));
    try {
        const text = await callWithRetry(prompt);
        return parseResult(text);
    } catch (err) {
        console.error('[AI generateAeoGeoFields]', err);
        throw new Error(classifyError(err));
    }
}

/**
 * Generate AEO/GEO fields from project content.
 * Uses the PROJECT PROMPT above.
 */
export async function generateAeoGeoFieldsForProject(
    title: string,
    desc: string,
    longDesc: string,
    tech: string[],
    role: string,
): Promise<AeoGeoResult> {
    const prompt = buildProjectPrompt(title, role, tech, desc, stripHtml(longDesc || desc));
    try {
        const text = await callWithRetry(prompt);
        return parseResult(text);
    } catch (err) {
        console.error('[AI generateAeoGeoFieldsForProject]', err);
        throw new Error(classifyError(err));
    }
}
