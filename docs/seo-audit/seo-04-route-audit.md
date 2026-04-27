# SEO Route Implementation Audit: Kartik Jindal Portfolio

## 1. Executive Summary
This audit provides a route-level verification of how SEO signals are actually emitted to search engines. The findings highlight a critical gap on the **Blog Index** (`/blog`), which effectively blocks search engines from seeing custom archive metadata. Furthermore, the **Project Narrative** content—while managed in the CMS—is largely invisible to search engines because it is contained within client-side modals without dedicated URLs.

---

## 2. Route-by-Route Breakdown

### A. Homepage (`/`)
- **Path**: `/`
- **Purpose**: Primary brand landing and conversion hub.
- **SEO Signals Present**: 
  - `generateMetadata` pulling from `site_config/seo_pages['home']`.
  - Canonical URL defined via `process.env.NEXT_PUBLIC_BASE_URL`.
  - OG/Twitter tags with CMS-controlled images.
  - JSON-LD `Person` schema.
- **SEO Signals Missing**: 
  - `ProfessionalService` or `WebSite` search box structured data.
- **Editable vs Hardcoded**: 
  - **Editable**: Titles, descriptions, keywords, social links.
  - **Hardcoded**: Job Title ("Full Stack Architect") in JSON-LD.
- **Issues and Risks**: Professional identity in structured data is disconnected from CMS branding fields.
- **Evidence Files**: `src/app/page.tsx`, `src/app/layout.tsx`.

### B. Journal Archive (`/blog`)
- **Path**: `/blog`
- **Purpose**: Discovery list for all technical and creative writing.
- **SEO Signals Present**: 
  - Root fallbacks from `layout.tsx`.
- **SEO Signals Missing**: 
  - **Dynamic Metadata**: The file is a Client Component (`'use client'`), which prevents exporting `generateMetadata`.
  - **Canonical Override**: Page-specific canonical is missing.
- **Editable vs Hardcoded**: 
  - **Grit**: The "Blog Archive" SEO map in the CMS is currently **non-functional** for this route.
- **Issues and Risks**: Search engines see the generic site title for the entire blog index, failing to rank for "Engineering Journal" or "Design Blog" keywords.
- **Evidence Files**: `src/app/blog/page.tsx`.

### C. Journal Post Detail (`/blog/[slug]`)
- **Path**: `/blog/[slug]`
- **Purpose**: Content-rich technical articles and case studies.
- **SEO Signals Present**: 
  - Full `seo` map integration (Manual Title/Desc/OG Image).
  - Canonical URL logic prioritizing CMS overrides.
  - Robots `index/follow` toggle support.
  - JSON-LD `BlogPosting`.
  - Text-only Breadcrumbs (`Home > Journal > Title`).
- **SEO Signals Missing**: 
  - `keywords` and `articleSection` are not yet mapped in the JSON-LD script.
- **Editable vs Hardcoded**: 
  - **Editable**: All metadata tags.
  - **Hardcoded**: Author name ("Kartik Jindal") in JSON-LD.
- **Issues and Risks**: Duplicate content risk if a post is accessed via ID instead of Slug (partially mitigated by canonicals).
- **Evidence Files**: `src/app/blog/[slug]/page.tsx`, `src/app/blog/[slug]/post-client.tsx`.

### D. Portfolio Archive (`/work`)
- **Path**: `/work`
- **Purpose**: Comprehensive showcase of builds and experiments.
- **SEO Signals Present**: 
  - `generateMetadata` pulling from `site_config/seo_pages['work']`.
  - Proper canonical URL.
- **SEO Signals Missing**: 
  - `CollectionPage` structured data.
- **Editable vs Hardcoded**: 
  - **Editable**: Archive-level metadata.
- **Issues and Risks**: **Extremely thin content signal**. Since individual project details are only rendered in a `Dialog` (Modal), search engines cannot crawl the "Long Description," "Methodology," or "Impact" sections of projects.
- **Evidence Files**: `src/app/work/page.tsx`, `src/app/work/work-client.tsx`.

### E. Admin Command Center
- **Path**: `/(admin)/admin/*`
- **Purpose**: Private management.
- **SEO Signals Present**: 
  - Explicit `disallow` in `robots.ts`.
- **Issues and Risks**: None (functioning as intended to prevent indexing).
- **Evidence Files**: `src/app/robots.ts`.

---

## 3. Duplicate Content Risk Map

| Source URL | Target URL | Risk | Mitigation |
|:---|:---|:---|:---|
| `/blog/[id]` | `/blog/[slug]` | High | Canonical URL correctly points to Slug. |
| `/` | `index.html` (Legacy) | Low | Not present in this framework. |
| `[slug]` | `[slug]/` (Trailing) | Low | Managed by Next.js routing layer. |

---

## 4. Weakest Routes First (Priority List)

1.  **`/blog` (Archive)**: **Critical**. Lacks dynamic metadata due to rendering strategy. Needs to be wrapped in a Server Component to export metadata.
2.  **Project Items**: **High**. 100% of project narrative content is currently un-indexable because it lacks dedicated URLs. Needs a sub-route pattern (e.g., `/work/[slug]`).
3.  **Hardcoded Schemas**: **Medium**. Author and Identity fields in JSON-LD should be wired to `site_config/global` to avoid code-level technical debt.