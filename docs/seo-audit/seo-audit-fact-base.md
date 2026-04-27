# SEO / GEO / AEO Audit Fact Base

## 1. Executive Summary
- **Current Status**: The site uses a modern **Next.js 15 App Router** architecture with a robust, CMS-driven SEO metadata layer. While item-level optimization for blog posts is excellent, significant architectural "dark spots" exist.
- **Biggest Strengths**: Granular per-item SEO maps (Title, Desc, Canonical, Indexable) managed in Firestore; dynamic XML sitemap generation; high-fidelity JSON-LD for articles.
- **Biggest Risks**: **Project narratives are invisible** to search and AI engines (rendered in client-side Modals without URLs); the **Blog Archive route is blocked** from emitting metadata (due to `'use client'` directive).
- **Biggest Missing Areas**: Image Alt Text fields in the CMS; Answer-engine optimized content (FAQs/Definitions); sub-routes for individual project case studies.

## 2. SEO Architecture Overview
- **Organization**: Centralized SEO management via the `site_config` collection and nested `seo` maps in content documents (`blog`, `projects`).
- **Metadata Flow**: `generateMetadata` (Server Component) -> Fetches Firestore map -> Fallback to derived content -> Renders `<head>` tags.
- **Sitemap/Robots**: Dynamic sitemap at `/sitemap.xml` crawls published blog posts; static `robots.ts` excludes administrative paths.
- **Admin Control**: Features a "SEO HUD" in the CMS with real-time scoring based on field presence and length.

## 3. Public Route Inventory

| Path | Render Mode | Title Strategy | Canonical Strategy | Schema Status | Risk Level |
|:---|:---|:---|:---|:---|:---|
| `/` | RSC | CMS Override (`seo_pages['home']`) | Base URL | Person (Hardcoded Job Title) | Low |
| `/work` | RSC | CMS Override (`seo_pages['work']`) | `/work` | Missing Collection Schema | **High** (Modal content) |
| `/blog` | **Client** | Root Layout Fallback (Blocked) | Missing | Missing | **Critical** (Blocked Metadata) |
| `/blog/[slug]` | RSC | Item-Level Map + Fallbacks | CMS Override Priority | BlogPosting (Dynamic) | Low |

## 4. Admin-Controlled SEO Surface

| Setting Name | Source File | Editable Fields | Route(s) Affected | Wiring Status |
|:---|:---|:---|:---|:---|
| **Global SEO** | `admin/seo/page.tsx` | Default Title, Desc, Keywords, OG Image | All (as fallback) | Fully Wired |
| **Page Overrides** | `admin/seo/page.tsx` | Title, Desc, Keywords per Route | `/`, `/work`, `/blog` | **Partial** (`/blog` ignored) |
| **Blog Item Map** | `admin/blog/[id]/page.tsx`| Title, Desc, Keywords, Indexable, Canonical | `/blog/[slug]` | Fully Wired |
| **Project Item Map**| `admin/projects/[id]/page.tsx`| Title, Desc, Keywords, Indexable, Canonical | N/A | **Unused** (Modal UI) |

## 5. Hardcoded / Derived SEO Behavior

| File Path | Hardcoded / Derived | Why it matters | Risk Level |
|:---|:---|:---|:---|
| `src/app/page.tsx` | Job Title: "Full Stack Architect" | Static in Person schema; doesn't update via CMS. | Medium |
| `src/app/sitemap.ts`| Priority: 1.0 (Home), 0.8 (Archives), 0.7 (Posts) | Controls relative crawl importance. | Medium |
| `src/app/blog/[slug]/page.tsx`| Suffix: ` | Kartik Jindal` | Enforces branding on all item titles. | Low |
| `src/app/blog/[slug]/post-client.tsx`| Author: "Kartik Jindal" | Static author in BlogPosting schema. | Medium |
| `src/app/robots.ts`| Disallow: `/admin/` | Shields command center from indexing. | Low |

## 6. Missing or Weak SEO / GEO / AEO Areas
- **Project Indexability**: 100% of project methodology and impact content is invisible to crawlers because it lacks dedicated URLs (Modal-only pattern).
- **Alt Text Gaps**: CMS editors lack explicit `altText` fields; components fallback to `title` or `imageHint`.
- **AEO Blocks**: No structured data for `FAQ`, `HowTo`, or `SoftwareApplication`. Content is not tagged for "Key Takeaways" or definitions.
- **Entity Inconsistency**: Personal branding in CMS doesn't sync with hardcoded Job Titles/Author names in schema scripts.
- **Blog Archive Meta**: The "Journal" page cannot rank for its own archive keywords because its rendering strategy blocks the Metadata API.

## 7. Performance / Crawlability Risks
- **LCP Distortion**: `src/components/portfolio/intro-screen.tsx` is a full-screen fixed overlay. Bots may measure the entrance animation as the Largest Contentful Paint.
- **Main Thread Bloat**: `Hero3D` (Three.js) runs on the main thread; potential impact on Interaction to Next Paint (INP) scores.
- **Hydration Risk**: Extensive use of Framer Motion for entrance animations may lead to hydration mismatches if server-rendered state isn't identical.

## 8. Entity / Authorship / Schema Review
- **Person (Home)**: Correctly maps social links from CMS. Job title and Name are static strings in `page.tsx`.
- **BlogPosting (Detail)**: Injected via `post-client.tsx`. Correctly maps headline, description, and date. Author name is hardcoded.
- **CreativeWork (Projects)**: **Missing**. No schema exists for individual projects, and their visibility is blocked by the Modal pattern.

## 9. Answer-Ready Content Review
- **Content Blocks**: Blog posts use generic `prose` formatting. No semantic tagging for AI answer snippets.
- **Concise Summaries**: The `summary` field in blog posts is a strong signal, but it is not wrapped in `WebPage` summary schema.
- **Discovery**: High-value "How-to" content in Project methodologies is trapped behind a user click (Dialog), making it inaccessible to answer engines.

## 10. Confirmed vs Inferred Findings
- **Confirmed**: `/blog` index has no unique metadata (Verified via `'use client'` directive).
- **Confirmed**: Projects are unindexable (Verified via `work-client.tsx` Dialog logic).
- **Inferred**: The Intro Screen negatively impacts LCP (Inferred based on position:fixed overlay behavior).
- **Inferred**: AI Engines cannot deep-link to project case studies (Inferred based on lack of static URLs).

## 11. File Reference Index
- `src/app/layout.tsx`: Root fallbacks and base template.
- `src/app/page.tsx`: Homepage metadata and Person schema.
- `src/app/blog/[slug]/page.tsx`: Post metadata orchestration.
- `src/app/blog/[slug]/post-client.tsx`: BlogPosting schema injection.
- `src/app/blog/page.tsx`: Client-side block for archive metadata.
- `src/app/work/work-client.tsx`: Modal-based project presentation (Indexing block).
- `src/app/sitemap.ts`: Dynamic discovery logic.
- `src/app/robots.ts`: Crawl exclusion rules.
- `src/components/admin/seo-hud.tsx`: Admin validation logic.