# Technical SEO Audit: Kartik Jindal Cinematic Portfolio

## 1. Executive Summary
The technical SEO architecture utilizes **Next.js 15 (App Router)** and **Server Components** to establish a high-performance foundation. However, the audit reveals a significant "dark spot" in indexability: the Portfolio is rendered via client-side Modals, and the Blog Archive is currently blocked from emitting metadata by its `'use client'` directive. Performance and Core Web Vitals (CWV) are also at risk due to the full-screen `IntroScreen` and global `Three.js` background, which likely impact LCP and Main-Thread work.

---

## 2. Technical SEO Inventory

| Feature | Implementation | Source |
|:---|:---|:---|
| **Crawl Control** | robots.txt dynamic generator | `src/app/robots.ts` |
| **Discovery** | XML Sitemap (Dynamic) | `src/app/sitemap.ts` |
| **Rendering** | Hybrid (RSC + Client Components) | Global |
| **Metadata** | Next.js Metadata API | Route-level |
| **Structured Data** | JSON-LD (Hardcoded/Dynamic Mix) | `page.tsx`, `post-client.tsx` |
| **Canonicals** | Metadata API (Base URL dependent) | `src/app/blog/[slug]/page.tsx` |
| **Image SEO** | `next/image` + S3 public URLs | `src/components/portfolio/*` |

---

## 3. Detailed Findings

### A. Crawlability & Sitemap
- **Robots Directives**: Properly configured to allow all public traffic while explicitly `disallow`-ing the `/(admin)` route group.
- **Sitemap Logic**: Correctly crawls the `blog` collection to generate dynamic URLs. 
- **Internal Link Path**: The site uses a "Flat" internal linking structure. Navigation is clear, but because projects use modals, there is no "Deep" crawl path for project case studies.

### B. Indexability & Rendering Boundaries
- **RSC Blocking**: `src/app/blog/page.tsx` is marked with `'use client'`. Next.js does not allow `generateMetadata` in Client Components. Consequently, the Journal index is effectively unoptimized.
- **Modal-Based Visibility**: Flagship and Experimental projects are rendered in `Dialog` (Modal) components. Search engines generally do not interact with Modals, meaning the unique "Long Description" and "Methodology" content for every project is **invisible to crawlers**.
- **Indexability Toggles**: The `blog` collection supports an `indexable` boolean map, which is correctly wired to the `robots` metadata tag in `[slug]/page.tsx`.

### C. Performance & Core Web Vitals
- **LCP Risk**: The `IntroScreen` is a fixed-position, full-screen animation that triggers on load. Bots may flag this as the "Largest Contentful Paint," leading to poor scores for perceived load speed.
- **Main Thread Work**: `Hero3D` (Three.js) runs on the main thread. While visually impressive, high execution times can lead to poor **Interaction to Next Paint (INP)** scores.
- **Image Optimization**: `next/image` is used globally, but `remotePatterns` in `next.config.ts` are overly permissive (`**`), which may lead to security/performance drift if non-optimized assets are used.

### D. Schema & Structured Data
- **Person Schema**: Present on the homepage. Social links are correctly mapped from the CMS.
- **Article Schema**: Present on blog details. 
- **Hardcoding Risks**: Both schemas hardcode "Kartik Jindal" as the entity name and "Full Stack Architect" as the job title. Changes to the "Personal Brand" CMS section do not update these rich results.

### E. URL and Canonical Handling
- **Environment Dependency**: All canonicals and sitemap links rely on `process.env.NEXT_PUBLIC_BASE_URL`. If this variable is missing, the site defaults to `https://kartikjindal.com`, which could create duplicate content issues if deployed to a different domain.
- **Slug Fallbacks**: If a slug is missing in Firestore, the code falls back to the Document ID. While functional, IDs are non-semantic and sub-optimal for SEO.

---

## 4. High-Risk Technical Issues

1.  **Critical Indexing Gap (Portfolio)**: 100% of project narrative content is unindexable because it lacks dedicated URLs/routes.
2.  **Metadata Block (Blog Archive)**: The Journal index cannot rank for "Engineering Blog" or related terms because the rendering strategy blocks metadata generation.
3.  **Performance/SEO Mismatch**: The `IntroScreen` and `Hero3D` background may incur search engine penalties for "Total Blocking Time" and LCP issues.
4.  **Static Identity**: Structured data identity is "locked" in code, leading to potential metadata mismatches as the brand evolves in the CMS.

---

## 5. Things That Appear Correct

- **Admin Security**: The `robots.txt` effectively shields the command center from being crawled.
- **Canonical Logic**: Item-level canonical overrides are correctly prioritized over auto-generated links.
- **Dynamic Sitemap**: The sitemap logic is robust and updates automatically as new posts are published.

---

## 6. Evidence Trace

- **Robots Logic**: `src/app/robots.ts`
- **Sitemap Logic**: `src/app/sitemap.ts`
- **Person Schema**: `src/app/page.tsx`
- **Article Schema**: `src/app/blog/[slug]/post-client.tsx`
- **RSC Boundaries**: `src/app/blog/page.tsx` (Client), `src/app/work/page.tsx` (Server)
- **Modal Pattern**: `src/app/work/work-client.tsx`
- **Performance Overlay**: `src/components/portfolio/intro-screen.tsx`