# SEO / GEO / AEO Master Roadmap: Kartik Jindal Portfolio

This roadmap outlines the exact 90-day execution plan to maximize search and generative engine visibility while maintaining a **zero-change policy** for the site's visual design.

---

## 1. Exact Priority Order

1.  **Priority 1: The Indexability Fix (Invisible)**
    - Unblock `/blog` metadata by moving the data fetch to the server.
    - Implement Intercepted Routes for `/work/[slug]` to make case studies indexable.
2.  **Priority 2: Entity Hardening (GEO)**
    - Wire JSON-LD `name`, `jobTitle`, and `sameAs` directly to `site_config/global`.
3.  **Priority 3: Image SEO Hardening**
    - Add `altText` fields to CMS and map to all `next/image` components.
4.  **Priority 4: AEO / Snippet Expansion**
    - Implement `FAQPage` and definition-block schema in blog posts.
5.  **Priority 5: Authority Content Velocity**
    - Publish "The Architecture of This Portfolio" to establish E-E-A-T.

---

## 2. 30 Day Plan: Foundational Hardening

| Week | Phase | Key Actions |
|:---|:---|:---|
| **Week 1** | **Infrastructure** | Resolve RSC Boundary on `/blog`; Setup Intercepted Project Routes. |
| **Week 2** | **Metadata Sync** | Wire all hardcoded Schema strings to CMS; Populate all missing Meta Maps. |
| **Week 3** | **Image Audit** | Add `altText` to all projects/posts via CMS; Verify `next/image` LCP optimization. |
| **Week 4** | **Content Launch** | Publish Case Study 1 (High Depth); Submit new Sitemap to GSC/Bing. |

---

## 3. 60 Day Plan: Growth Actions

- **AEO Injection**: Identify top 10 technical questions in your niche; add hidden "Answer Blocks" to relevant blog posts.
- **GEO Citation**: Update all social profiles (LinkedIn, Twitter, GitHub) to use the exact job title ("Full Stack Architect") defined in CMS.
- **Internal Link Audit**: Ensure every Blog Post links to at least one Project Case Study.
- **Backlink Outreach**: Share technical case studies on specialized forums (HackerNews, Dev.to) to drive early authority signals.

---

## 4. 90 Day Plan: Authority Actions

- **Case Study Deep-Dives**: Transition from "Project Overviews" to "Technical Whitepapers" for flagship builds.
- **Rich Result Monitoring**: Verify if Projects are appearing with `SoftwareApplication` or `CreativeWork` snippets.
- **Answer Engine Verification**: Query Perplexity/Gemini for "How does Kartik Jindal build [X]?" and refine schema until cited.
- **Maintenance**: Audit "SEO HUD" scores in Admin; prune or update posts with scores < 80.

---

## 5. Content Publishing Calendar

| Month | Theme | Primary Post | Goal |
|:---|:---|:---|:---|
| **Month 1** | **Infrastructure** | "The Architecture of a Cinematic Portfolio" | Recruiter Trust (E-E-A-T) |
| **Month 2** | **Performance** | "Optimizing Three.js for Core Web Vitals" | AEO (Featured Snippets) |
| **Month 3** | **AI/Generative** | "Building LLM-Powered Dashboards with Genkit" | GEO (Niche Authority) |

---

## 6. Internal Linking Execution Plan

- **The "Case Study Loop"**: Blog Post (Problem) -> Project Case Study (Solution) -> Contact (Action).
- **Footer Resilience**: Ensure the Footer links directly to the most "Authority-Heavy" post.
- **Breadcrumb Navigation**: Maintain strict `Home > Journal > Post` structure for crawler path clarity.

---

## 7. GEO Citation Plan

AI engines look for consistency. You must synchronize your identity across:
1. **The Site**: `site_config/global` (Source of Truth).
2. **LinkedIn**: Update Headline to match CMS.
3. **GitHub**: Add `url` to your profile pointing to the specific Project Archive.
4. **Schema**: Ensure `sameAs` array in JSON-LD contains all these verified links.

---

## 8. AEO Snippet Plan

Target "How-to" and "Definition" queries using:
- **Definition Blocks**: "Digital Architecture is defined as..." (Wrap in specific semantic tags).
- **Methodology Lists**: Use ordered lists (`<ol>`) for technical steps; AI prefers structured sequences.
- **Concise Summaries**: Keep the CMS `summary` field under 150 characters for clean snippet rendering.

---

## 9. KPI Dashboard (Measure Weekly)

- **GSC Search Console**: Total Clicks and Impressions for "Kartik Jindal" and "Next.js Architect."
- **Index Status**: Count of indexed URLs (Goal: 100% of Projects + Posts).
- **Core Web Vitals**: LCP and INP scores (Ensure visual design isn't penalizing ranking).
- **AEO Check**: Monitor "People Also Ask" blocks for your targeted technical queries.

---

## 10. Mistakes To Avoid

- **Design Regression**: Never sacrifice the 3D environment for speed; optimize the loading sequence instead.
- **Keyword Stuffing**: Keep metadata cinematic and human-readable.
- **Thin Content**: Avoid publishing projects without a methodology narrative.
- **Orphan Pages**: Ensure every new project/post is linked from the Archive and Sitemap.

---

## 11. Expected Results Timeline

- **Day 15**: Sitemap fully indexed; Meta titles appear in Google.
- **Day 45**: Project narratives become searchable for the first time.
- **Day 75**: First "Rich Snippet" or "Answer Overview" citation.
- **Day 90**: Topical authority established in "Full Stack Architecture" and "Cinematic UI."

---

## 12. Final Success Blueprint

The ultimate goal is to transform the site into a **Knowledge Hub**. By providing structured, high-fidelity technical narratives, you ensure that both humans (recruiters) and machines (AI) see you as the definitive authority in your creative engineering niche.