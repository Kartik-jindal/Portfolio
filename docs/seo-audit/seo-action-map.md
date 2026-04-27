# SEO / GEO / AEO Action Map: Kartik Jindal Portfolio

This document outlines a strategic implementation plan to maximize search and generative engine visibility while maintaining a **strict zero-change policy** for the site's visual design, animations, and cinematic experience.

## 1. Executive Summary: The "Invisible" SEO Layer
The goal is to move SEO metadata and Case Study content from "Client-Side Dialogs" into the "Server-Side Index," ensuring that search and AI engines can crawl 100% of the site's narrative without altering a single pixel of the current UI.

---

## 2. High-Impact Structural Enhancements (Invisible)

### Opportunity 1: RSC Boundary Fix (Blog Index)
- **File Path**: `src/app/blog/page.tsx`
- **Page Affected**: Journal Archive (`/blog`)
- **Risk**: Low (Purely structural)
- **Impact**: Critical (Enables metadata)
- **Why Safe**: It involves moving the data fetch to the server and passing it to a Client Component for the list rendering.
- **Why Valuable**: Allows the `/blog` page to emit unique titles and descriptions from the CMS, currently blocked by `'use client'`.

### Opportunity 2: Intercepted Project Routing
- **File Path**: `src/app/work/[slug]/page.tsx` and `src/app/work/@modal/(.)[slug]/page.tsx`
- **Page Affected**: Project Case Studies
- **Risk**: Medium (Routing complexity)
- **Impact**: High (100% Indexability)
- **Why Safe**: Uses Next.js Parallel/Intercepted routes. When a user clicks a project, they see the **same Modal** they see now. When a bot crawls the link, it hits a **Server-Side Page**.
- **Why Valuable**: Unlocks all "Methodology," "Impact," and "Narrative" content for search engine ranking and AI citations.

---

## 3. Metadata & Schema Expansion

### Opportunity 3: Dynamic Entity Wiring
- **File Path**: `src/app/page.tsx`, `src/app/blog/[slug]/post-client.tsx`
- **Page Affected**: Global / Item Level
- **Risk**: Very Low
- **Impact**: Medium (GEO/AEO Accuracy)
- **Why Safe**: Replaces hardcoded strings ("Full Stack Architect") with variables from `site_config/global`.
- **Why Valuable**: Ensures that if you change your brand title in the Admin Panel, search engines see the updated identity immediately without a code redeploy.

### Opportunity 4: Project-Specific JSON-LD
- **File Path**: `src/app/work/work-client.tsx` (or new intercepted page)
- **Page Affected**: Work Detail
- **Risk**: Low
- **Impact**: Medium (Rich Snippets)
- **Why Safe**: Adds a `<script type="application/ld+json">` tag which is invisible to users.
- **Why Valuable**: Implements `CreativeWork` or `SoftwareApplication` schema for projects, allowing them to appear as rich results.

---

## 4. Content & Answer-Engine Optimization (AEO)

### Opportunity 5: FAQ Structured Data
- **File Path**: `src/app/blog/[slug]/post-client.tsx`
- **Page Affected**: Blog Detail
- **Risk**: Low
- **Impact**: Medium (AEO / Voice Search)
- **Why Safe**: Purely data-level; no visual FAQ accordion needed.
- **Why Valuable**: Injects an `FAQPage` schema based on the "Strategic Methodology" or "Challenges" fields in your CMS.

### Opportunity 6: "Answer Block" Metadata
- **File Path**: `src/app/blog/[slug]/page.tsx`
- **Page Affected**: Blog Detail
- **Risk**: Low
- **Impact**: High (Google Snippets / AI Overviews)
- **Why Safe**: Adds a "Key Takeaways" or "Summary" field to the meta-tags (which bots read) without displaying it in the main article body if not desired.
- **Why Valuable**: Feeds concise, definition-style strings directly to Answer Engines.

---

## 5. Admin Panel Extensions

### Opportunity 7: Image Alt Text Wiring
- **File Path**: `src/app/(admin)/admin/blog/[id]/page.tsx` & `src/app/(admin)/admin/projects/[id]/page.tsx`
- **Affected Surface**: CMS Dashboard
- **Risk**: Low
- **Impact**: Medium (Image SEO)
- **Why Safe**: Only adds an input field to the private Admin Panel.
- **Why Valuable**: Allows you to specify descriptive Alt Text for every image, replacing the current "Image Hint" fallback.

### Opportunity 8: Global Robots Toggle
- **File Path**: `src/app/(admin)/admin/settings/page.tsx`
- **Affected Surface**: Site Settings
- **Risk**: Low
- **Impact**: High (Strategic Control)
- **Why Safe**: Affects only the `robots.txt` output.
- **Why Valuable**: Lets you switch the whole site to `noindex` from the Admin Panel during major updates or maintenance.

---

## 6. Execution Priority (ROI Order)

1.  **Priority 1: Blog Index SSR Boundary** (High Impact / Low Risk) - Unlocks the Journal's primary SEO map.
2.  **Priority 2: Dynamic Schema Wiring** (High GEO Impact / Very Low Risk) - Aligns identity with the CMS.
3.  **Priority 3: Project URL Interception** (Highest Impact / Medium Risk) - The "Big Win" for 100% case study visibility.
4.  **Priority 4: Admin Alt Text Fields** (Medium Impact / Low Risk) - Hardens Image SEO.
5.  **Priority 5: AEO/JSON-LD Expansion** (Long-term GEO play) - Maximizes rich snippet potential.

---

## 7. Implementation Safeguards
- **Shadow Testing**: Every new route (`/work/[slug]`) will be verified against the current Dialog logic to ensure zero regression in the "Cinematic Scroll" behavior.
- **Canonical Priority**: Canonical tags will always point to the SEO-optimized URL to prevent duplicate content risks between the Archive list and dynamic Case Studies.