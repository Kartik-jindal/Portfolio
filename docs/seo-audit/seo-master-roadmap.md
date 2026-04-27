# SEO / GEO / AEO Master Roadmap: Kartik Jindal Portfolio

This roadmap outlines the exact 90-day execution plan to maximize search and generative engine visibility while maintaining a **zero-change policy** for the site's visual design.

---

## 1. Exact Priority Order

1.  **Priority 1: The Indexability Fix (Invisible)**
    - Unblock `/blog` metadata by moving data fetching to a Server Component.
    - Implement Intercepted Routes for `/work/[slug]` to provide crawlers with unique URLs while keeping the user-facing Modal.
2.  **Priority 2: Entity & Identity Hardening (GEO)**
    - Wire JSON-LD `name`, `jobTitle`, and `sameAs` directly to `site_config/global` to ensure a consistent brand graph.
3.  **Priority 3: Image SEO & Accessibility**
    - Add explicit `altText` fields to the CMS for all project and blog assets.
4.  **Priority 4: AEO / Answer-Engine Expansion**
    - Implement `FAQPage` schema and semantic "Answer Blocks" within high-value blog posts.
5.  **Priority 5: Authority Content Launch**
    - Publish "The Architecture of a Cinematic Portfolio" to establish E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness).

---

## 2. 30 Day Plan: Foundational Hardening

| Week | Focus | Key Actions |
|:---|:---|:---|
| **Week 1** | **Infrastructure** | Resolve RSC Boundary on `/blog`; Setup Intercepted Project Routes for `/work/[slug]`. |
| **Week 2** | **Metadata Sync** | Map all hardcoded Schema strings to the CMS; Populate all missing Page-Level Meta Maps. |
| **Week 3** | **Image SEO** | Add `altText` to all existing projects/posts; Verify `next/image` LCP optimization for mobile. |
| **Week 4** | **Initial Indexing** | Submit updated dynamic Sitemap to Google Search Console; Verify project URLs are crawlable. |

---

## 3. 60 Day Plan: Growth Actions

- **AEO Injection**: Identify top 10 technical queries in the "Creative Engineering" niche; add semantic "Answer Blocks" to relevant posts.
- **GEO Citation Sync**: Update all external social profiles (LinkedIn, Twitter, GitHub) to match the Job Title and Entity Name defined in the CMS.
- **Internal Link Audit**: Ensure every Blog Post links to at least one Project Case Study to strengthen the "Knowledge Graph."
- **Social Signal Boost**: Distribute technical case studies on specialized forums (HackerNews, Dev.to) to drive early authority signals.

---

## 4. 90 Day Plan: Authority Actions

- **Case Study Deep-Dives**: Transition from "Project Overviews" to "Technical Whitepapers" for the 3 flagship builds.
- **Rich Result Optimization**: Verify if Projects are appearing with `SoftwareApplication` or `CreativeWork` snippets in search results.
- **Answer Engine Verification**: Query AI engines (Perplexity/Gemini) for "How does Kartik Jindal build [X]?" and refine schema until cited.
- **Maintenance**: Audit "SEO HUD" scores in the Admin panel; prune or update any content with a score < 80.

---

## 5. Content Publishing Calendar

| Month | Theme | Primary Post | Goal |
|:---|:---|:---|:---|
| **Month 1** | **Infrastructure** | "The Architecture of a Cinematic Portfolio" | Trust & E-E-A-T |
| **Month 2** | **Performance** | "Optimizing Three.js for Core Web Vitals" | AEO Snippets |
| **Month 3** | **AI/Generative** | "Building LLM-Powered Dashboards with Genkit" | GEO Niche Authority |

---

## 6. Internal Linking Execution Plan

- **The "Case Study Loop"**: Blog Post (Problem) -> Project Case Study (Solution) -> Contact (Action).
- **Footer Resilience**: Ensure the Footer links directly to the most "Authority-Heavy" post of the month.
- **Breadcrumb Navigation**: Maintain a strict `Home > Journal > Post` and `Home > Work > Project` path for crawler clarity.

---

## 7. GEO Citation Plan

AI engines look for consistency across the web. You must synchronize your identity:
1. **The Site**: `site_config/global` (The Source of Truth).
2. **LinkedIn**: Update Headline to match the CMS "Job Title."
3. **GitHub**: Add a link to your "Project Archive" in your profile README.
4. **Schema**: Ensure the `sameAs` array in your JSON-LD contains all these verified external links.

---

## 8. AEO Snippet Plan

Target "How-to" and "Definition" queries by using:
- **Definition Blocks**: "Creative Engineering is defined as..." (Wrapped in semantic `<dfn>` or `<strong>` tags).
- **Ordered Methodology**: Use `<ol>` for project steps; AI engines prefer structured sequences for "How-to" answers.
- **Concise Summaries**: Keep the CMS `summary` field under 150 characters for clean meta-snippet extraction.

---

## 9. KPI Dashboard (Measure Weekly)

- **Search Visibility**: Total Clicks and Impressions for "Kartik Jindal" and "Next.js Architect" in GSC.
- **Index Status**: Count of indexed project and post URLs (Goal: 100%).
- **Answer Engine Presence**: Direct citations or mentions in AI overviews for targeted technical terms.
- **Core Web Vitals**: LCP and INP scores (Ensure the 3D environment isn't penalizing ranking).

---

## 10. Mistakes To Avoid

- **Design Regression**: Do not sacrifice the 3D background for raw speed; optimize the loading sequence instead.
- **Keyword Stuffing**: Keep all CMS metadata cinematic and human-readable.
- **Thin Content**: Never publish a project without a "Methodology" narrative; it won't rank for "Solution" queries.
- **Orphan Pages**: Ensure every new project/post is reachable from a top-level Archive and the Sitemap.

---

## 11. Expected Results Timeline

- **Day 15**: Sitemap fully indexed; Meta titles appear correctly in Google Search.
- **Day 45**: Project narratives become searchable/indexable for the first time via unique URLs.
- **Day 75**: First "Rich Snippet" or "AI Answer Overview" citation appears for a technical keyword.
- **Day 90**: Topical authority established in "Full Stack Architecture" and "Cinematic UI."

---

## 12. Final Success Blueprint

The ultimate goal is to transform the site into a **Knowledge Hub**. By providing structured, high-fidelity technical narratives, you ensure that both humans (recruiters) and machines (AI) see you as the definitive authority in your creative engineering niche.