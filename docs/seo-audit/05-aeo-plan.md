# Answer Engine Optimization (AEO) Implementation Plan

## 1. Objectives
Maximize the probability of winning "Featured Snippets" and appearing in "AI Overviews" (Google, Perplexity) by providing structured, concise answers to specific technical questions directly within the CMS.

## 2. AEO Data Modules

### A. Quick Answer & Summary
- **Problem**: AI engines need a 1-2 sentence "definition-style" summary of a project or post to use as an intro snippet.
- **Solution**: Add a "Quick Answer" field (max 250 chars) to all editors.

### B. FAQ Engine (Question/Answer Pairs)
- **Problem**: Technical users often query "How to..." or "What is..." questions. Unstructured prose is harder for bots to parse as direct answers.
- **Solution**: Add a repeatable FAQ block to Projects and Journal entries.
- **Fields**: Question, Answer.

### C. Strategic Insights (Key Takeaways)
- **Problem**: "Key Takeaways" are high-signal areas for AI summaries.
- **Solution**: Add a "Key Takeaways" list manager.

### D. Technical Comparison (Pros/Cons)
- **Problem**: Technical experiments often involve trade-offs. Structured pros/cons help AI engines answer comparison queries.
- **Solution**: Add "Pros" and "Cons" list managers for Projects and Blog posts.

## 3. Files Affected
- `src/app/(admin)/admin/projects/[id]/page.tsx` (AEO Section)
- `src/app/(admin)/admin/projects/new/page.tsx` (AEO Section)
- `src/app/(admin)/admin/blog/[id]/page.tsx` (AEO Section)
- `src/app/(admin)/admin/blog/new/page.tsx` (AEO Section)

## 4. Safety & UI Preservation
- **Admin Only**: New fields will appear in the administrative command center.
- **No Design Changes**: These fields are stored in Firestore for future JSON-LD expansion or invisible meta-tagging; they do not force any new visual elements on the public frontend.
- **Schema Preservation**: Existing content and SEO maps are untouched.