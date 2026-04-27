# SEO / GEO / AEO Fact Base

## Executive Summary
The Kartik Jindal Portfolio utilizes a **Next.js 15 App Router** architecture with **Cloud Firestore** for content management. While the site features a sophisticated "SEO HUD" in the Admin Panel and robust metadata/schema support for blog posts, it currently suffers from two major "indexing black holes": the Blog Archive is blocked from emitting metadata by a `'use client'` directive, and 100% of project-specific narrative content is invisible to crawlers because it is rendered inside client-side Modals without dedicated URLs. For GEO/AEO, the hardcoded nature of structured data entities limits the "Personal Brand" CMS's ability to update the site's knowledge graph identity.

## Current State by Area

### SEO (Traditional Search)
- **Status**: Partially Implemented / Risky.
- **Confirmed**: `generateMetadata` is used on the Homepage and Blog Details. Sitemap is dynamic and includes published blog slugs.
- **Risky**: `src/app/blog/page.tsx` is a Client Component, which Next.js prohibits from exporting `generateMetadata`. Traditional crawlers see generic root fallbacks for the entire journal archive.
- **Risky**: Projects use `Dialog` (Modal) components. Crawlers typically do not trigger modals, meaning case study narratives are non-indexable.

### GEO (Generative / AI Search)
- **Status**: Partially Implemented.
- **Confirmed**: Structured data (JSON-LD) for `Person` and `BlogPosting` provides a foundation for AI engines to identify the author and entity relationships.
- **Missing**: Explicit citation links or "sameAs" verification for all social profiles in every post schema.
- **Hardcoded**: Author name and Job Title are hardcoded in schema scripts, creating a potential mismatch if the CMS brand identity is changed but the code is not redeployed.

### AEO (Answer Engine Optimization)
- **Status**: Missing / Thin.
- **Missing**: No `FAQ` structured data or answer-ready content blocks (concise summaries for specific technical questions).
- **Blocked**: The most valuable "how-to" and "impact" content is locked within project case studies that lack dedicated routes, preventing AI engines from deep-linking to specific technical solutions.

## Public Route Inventory

| Path | Purpose | Rendering | SEO Status | AEO/GEO Status |
|:---|:---|:---|:---|:---|
| `/` | Landing Hub | RSC | Wired (CMS) | Person Schema present |
| `/work` | Portfolio | RSC | Wired (Archive) | Collection visibility |
| `/blog` | Journal Index | **Client** | **Blocked** | Generic tags only |
| `/blog/[slug]` | Post Detail | RSC | Fully Optimized | BlogPosting Schema |
| `/admin/*` | Management | Client | Disallowed | Hidden (Correct) |

## Admin-Controlled SEO Surface
- **Global Defaults**: `site_config/global` (Title, Desc, OG Image).
- **Page Overrides**: `site_config/seo_pages` (Home, Work, Blog).
- **Item SEO Maps**: Nested `seo` objects in `blog` and `projects` collections containing `title`, `description`, `keywords`, `ogImage`, `indexable`, and `canonicalUrl`.
- **Validation**: `src/components/admin/seo-hud.tsx` provides real-time scoring based on length and presence of fields.

## Hardcoded SEO / GEO / AEO Behavior
- **Sitemap Priority**: Hardcoded at `1.0` (Home), `0.8` (Archives), `0.7` (Posts) in `src/app/sitemap.ts`.
- **Identity Schema**: Name ("Kartik Jindal") and Job Title ("Full Stack Architect") are hardcoded in `page.tsx` and `post-client.tsx`.
- **Title Suffix**: The ` | Kartik Jindal` brand mark is enforced via template strings in metadata functions.
- **Robots Directives**: Disallow rules for `/admin` are hardcoded in `src/app/robots.ts`.

## Missing or Weak Areas
- **Project Indexing**: The Modal presentation pattern (`src/app/work/work-client.tsx`) prevents 100% of project case study content from being indexed.
- **Image Alt Text**: No dedicated CMS field for Alt Text; components rely on `title` or `imageHint`.
- **RSC Boundary (Blog)**: The `'use client'` directive on `/blog` renders the CMS "Blog Archive" SEO map non-functional.
- **Global Robots Toggle**: No mechanism to switch the entire site to `noindex` via the Admin Panel.

## Performance / Crawlability Risks
- **LCP Measurement**: `src/components/portfolio/intro-screen.tsx` is a full-screen fixed animation. Bots may measure this as the Largest Contentful Paint, potentially penalizing the site for perceived slow loading.
- **Main Thread Work**: `Hero3D` (Three.js) runs on the main thread and may impact "Total Blocking Time" signals.
- **Hydration Mismatch**: Heavy use of Framer Motion for entrance animations may lead to hydration warnings if server-rendered content is not precisely matched in the client.

## Entity / Authorship / Schema Review
- **Person (Home)**: Correctly maps social links from `site_config/global`. Job title is static.
- **BlogPosting (Posts)**: Injected via `post-client.tsx`. Includes headline, description, image, and date.
- **CreativeWork (Projects)**: **Missing**. No schema exists for individual projects.
- **Authorship**: Identity is clear but rigid. The "soul" of the personal brand is in the CMS, but the "identity" of the entity is in the code.

## Answer-Ready Content Review
- **Structure**: Blog posts use HTML/Markdown in the `content` field. While good for traditional reading, they lack semantic tagging for "Definitions" or "Key Takeaways" that AI answer engines prefer.
- **Discoverability**: High technical value content (Methodology/Impact) in projects is locked behind modals, making it invisible to "How-to" generative queries.

## File Reference Index
- **Metadata Controllers**: `src/app/page.tsx`, `src/app/work/page.tsx`, `src/app/blog/[slug]/page.tsx`.
- **Tech SEO**: `src/app/robots.ts`, `src/app/sitemap.ts`.
- **Schema Injection**: `src/app/page.tsx` (Person), `src/app/blog/[slug]/post-client.tsx` (Article).
- **Admin UI**: `src/app/(admin)/admin/seo/page.tsx`, `src/components/admin/seo-hud.tsx`.
- **Interaction Logic**: `src/components/portfolio/custom-cursor.tsx`, `src/components/portfolio/intro-screen.tsx`.

## Confirmed vs Inferred Findings
- **Confirmed**: Metadata is missing on `/blog` (Verified via code directive).
- **Confirmed**: Projects lack dedicated routes (Verified via `work-client.tsx` Dialog logic).
- **Inferred**: The intro screen negatively impacts Core Web Vitals (Inferred based on position:fixed and full-screen overlay nature).
- **Inferred**: AI Engines will struggle to attribute project methodologies to the Kartik Jindal entity due to the lack of dedicated project routes.