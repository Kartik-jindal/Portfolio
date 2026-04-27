# SEO Master Plan: Direct Implementation Strategy

This document outlines the high-ROI technical changes required to unlock 100% indexability and improve Generative Engine visibility (GEO) without modifying a single pixel of the current UI.

## 1. Identified Issues & Risks

| Category | Issue Found | SEO Impact | Risk Level |
|:---|:---|:---|:---|
| **Rendering** | `blog/page.tsx` is `'use client'`, blocking Server-Side metadata. | High | Low |
| **Indexability** | Projects (Case Studies) lack URLs; they are only in Modals. | Critical | Medium |
| **AEO/GEO** | Structured Data (JSON-LD) uses hardcoded strings. | Medium | Low |
| **Discovery** | Sitemap excludes individual project case studies. | High | Low |
| **Performance** | `IntroScreen` overlay risks being measured as LCP by bots. | Medium | Low |

## 2. Implementation Plan

### Phase A: The RSC Boundary (Invisible Fix)
- **Files**: `src/app/blog/page.tsx`
- **Action**: Refactor the main Journal archive to a Server Component. Pass fetched data to a child Client Component.
- **Why Safe**: Purely structural. The UI components remain identical.
- **Impact**: Enables `generateMetadata` for the Journal index, allowing it to rank for search queries.

### Phase B: Intercepted Project Routing (The "Big Win")
- **Files**: `src/app/work/[slug]/page.tsx`, `src/app/work/@modal/(.)[slug]/page.tsx`
- **Action**: Implement Next.js Parallel and Intercepted routes. 
- **Behavior**: 
    - User clicks a project -> URL updates to `/work/slug` + **Modal opens** (Same as now).
    - Bot/Direct Link hits `/work/slug` -> **Full Page renders** (New Server-Side page).
- **Why Safe**: Preserves the exact interactive experience while giving bots a crawlable URL.

### Phase C: Dynamic Schema wiring
- **Files**: `src/app/page.tsx`, `src/app/blog/[slug]/post-client.tsx`
- **Action**: Replace hardcoded "Full Stack Architect" and "Kartik Jindal" with variables from `site_config/global`.
- **Impact**: Aligns the site's "Knowledge Graph" identity with the CMS.

### Phase D: Sitemap & Robots Hardening
- **Files**: `src/app/sitemap.ts`, `src/app/robots.ts`
- **Action**: Include dynamic project slugs in the sitemap. Add `lastmod` tracking.

## 3. Rollback Path
1. Reverting the file changes in Git will restore the previous modal-only and client-rendered archive states.
2. The UI is decoupled from the routing logic; if a parallel route fails, the standard link behavior still works.

## 4. Visual Preservation Guarantee
- No CSS variables will be touched.
- No Framer Motion durations or easings will be altered.
- No HSL theme values will change.
- The 3D background and Custom Cursor remain untouched.
