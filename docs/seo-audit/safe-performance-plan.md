# Safe Performance Improvement Plan

## 1. Executive Summary
- The main confirmed performance pressure comes from global client work that mounts on every route: `AuthProvider`, `Toaster`, `Hero3D`, and `CustomCursor` in `src/app/layout.tsx`.
- The public route bundle is also inflated by Firebase client imports inside motion-heavy portfolio components that already receive server-fetched props on their primary routes.
- The highest-risk areas are the cinematic systems: `hero-3d.tsx`, `intro-screen.tsx`, `custom-cursor.tsx`, and any change that would alter first paint, animation timing, pointer feel, or perceived loading choreography.
- The safest high-ROI opportunities are:
  - scope admin-only auth/toast code out of the public root layout
  - remove the unused `headers()` bot-detection work in the root layout
  - convert `project-detail-content.tsx` back to a server component
  - add missing `sizes` hints to large `next/image` usages
  - deduplicate repeated Firestore reads between `generateMetadata()` and page rendering
- Previous docs in `docs/seo-audit` contain stale findings that are no longer true in the current repo. Confirmed examples:
  - `src/app/blog/page.tsx` is currently a Server Component, not a client page
  - the Google Fonts URL in `src/app/layout.tsx` already includes `display=swap`

## 2. Safety Rules Used
Safe means all of the following are true:

- The rendered UI remains visually identical.
- Layout, spacing, typography, colors, and page structure remain unchanged.
- Animation output, timing, sequencing, and cursor/scroll feel remain unchanged.
- User flow and interaction patterns remain unchanged.
- Data freshness and route behavior remain unchanged.
- Any performance gain comes from code placement, fetch deduplication, image hinting, or bundle isolation rather than visual redesign.

Excluded or downgraded items:

- Anything that delays, removes, or retimes cinematic elements.
- Anything that changes caching freshness semantics for CMS-backed content.
- Anything that risks different fonts, different first-paint appearance, or different modal/page loading feel.
- Any package removal or config tightening that could break unpublished or admin-only features without stronger evidence.

## 3. Safe Improvement Matrix

| Improvement | File(s) affected | Why it helps | Why it is safe | Visible impact (must be none) | Functionality impact (must be none) | Animation impact (must be none) | Risk level | Recommendation |
|---|---|---|---|---|---|---|---|---|
| Move auth and toast runtime out of public root layout and into admin-only layout | `src/app/layout.tsx`, `src/app/(admin)/admin/layout.tsx`, `src/context/auth-context.tsx`, `src/components/ui/toaster.tsx` | Removes Firebase Auth and toast runtime from public routes, reducing public JS and hydration work | `useAuth()` and `toast()` are only used in admin routes | None | None if admin still wraps all admin pages | None | Low | SAFE TO IMPLEMENT |
| Remove unused `headers()` and bot-detection work from root layout | `src/app/layout.tsx` | Avoids unnecessary per-request server work and removes a dynamic read that is currently unused | `isBot` is computed but never used | None | None | None | Low | SAFE TO IMPLEMENT |
| Convert `ProjectDetailContent` to a Server Component | `src/components/portfolio/project-detail-content.tsx`, consumers in `src/app/work/[slug]/page.tsx` and `src/app/work/@modal/(.)[slug]/page.tsx` | Removes unnecessary client boundary and framer-motion import from project detail payloads | The component has no hooks, no state, and no active client-only behavior in current usage | None | None | None, because there is no motion logic inside the component today | Low | SAFE TO IMPLEMENT |
| Add missing `sizes` hints to large `next/image` usages | `src/components/portfolio/projects.tsx`, `src/app/work/work-client.tsx`, `src/components/portfolio/project-detail-content.tsx`, `src/app/blog/[slug]/post-client.tsx` | Reduces oversized image downloads and route payload weight | `sizes` only informs responsive image selection; it does not change layout or styling | None | None | None | Low | SAFE TO IMPLEMENT |
| Deduplicate repeated Firestore reads within a request | `src/app/page.tsx`, `src/app/work/page.tsx`, `src/app/blog/page.tsx`, `src/app/blog/[slug]/page.tsx`, `src/app/work/[slug]/page.tsx`, `src/app/sitemap.ts` | Reduces repeated server fetches between metadata generation and page rendering | Data source and returned values remain the same | None | None | None | Medium | SAFE TO IMPLEMENT |
| Make navbar scroll listener passive | `src/components/portfolio/navbar.tsx` | Slightly reduces main-thread blocking risk on scroll | Passive listener does not change the threshold or styling logic | None | None | None | Low | SAFE TO IMPLEMENT |
| Remove public-component Firestore fallback imports by always providing server-fetched props on routed pages | `src/components/portfolio/hero.tsx`, `about.tsx`, `experience.tsx`, `testimonials.tsx`, `navbar.tsx`, `footer.tsx`, `projects.tsx`, `contact.tsx`, plus route files that render them | Can significantly cut public bundle size by keeping Firebase client SDK out of many public components | Safe only if all existing prop paths are wired for every route and fallback defaults remain intact | None if fully matched | None if every route supplies the same data | None if motion components remain unchanged | Medium | SAFE ONLY WITH CONDITIONS |
| Split Firebase modules so public routes import Firestore-only code while auth/storage stay admin or server-only | `src/lib/firebase/config.ts` and all imports that currently consume it | Prevents public routes from paying for `firebase/auth` and `firebase/storage` when they only need Firestore | Safe only if import graph is carefully separated and all admin/auth/storage flows are preserved | None | None if module boundaries are correct | None | Medium | SAFE ONLY WITH CONDITIONS |
| Split blog post page into server-rendered shell plus minimal client islands | `src/app/blog/[slug]/post-client.tsx`, `src/app/blog/[slug]/page.tsx`, possibly `breadcrumbs.tsx` or a new progress-bar island | Can reduce hydration cost on article pages while preserving the same rendering | Safe only if the same DOM, same progress bar, and same motion output are preserved | None if identical markup is preserved | None | None if the progress bar and entry motion are preserved exactly | Medium | SAFE ONLY WITH CONDITIONS |
| Stabilize sitemap `lastModified` values and stop using `new Date()` for route entries | `src/app/sitemap.ts` | Improves crawl efficiency and avoids misleading freshness signals | Invisible to users, but only safe if the source of truth for timestamps is authoritative | None | None | None | Medium | SAFE ONLY WITH CONDITIONS |
| Lazy-load `Hero3D`, `IntroScreen`, or `CustomCursor` | `src/app/layout.tsx`, `src/components/portfolio/hero-3d.tsx`, `intro-screen.tsx`, `custom-cursor.tsx` | Could reduce initial JS cost | These elements define the cinematic first impression and interaction feel; load timing changes are user-visible | Likely | Possible | Likely | High | NOT SAFE FOR THIS PROJECT |
| Replace the Google Fonts link with a different loading strategy | `src/app/layout.tsx` | Could improve font loading metrics | Any shift in font loading behavior can change first-paint appearance or typography timing | Possible | None | Possible | High | NOT SAFE FOR THIS PROJECT |
| Remove `force-dynamic` or add ISR/revalidation caching to public pages | `src/app/page.tsx`, `src/app/work/page.tsx`, `src/app/blog/page.tsx` | Could improve TTFB and server load | It changes freshness semantics for CMS-backed content | None visually, but behavior changes | Yes, content freshness changes | None | High | NOT SAFE FOR THIS PROJECT |
| Tighten `images.remotePatterns` from wildcard hosts to an allowlist | `next.config.ts` | Can reduce misuse and help control image sources | Current CMS data may rely on arbitrary hosts; changing this can break live images | None if all hosts are known, otherwise broken images | Possible | None | Medium | NEEDS MANUAL REVIEW |
| Remove apparently unused packages or shadcn UI primitives | `package.json`, unused UI files, `src/ai/*` | Could reduce install weight and maintenance | Repo evidence shows some items are unused by current routes, but scripts and future admin features may still depend on them | None if truly unused | Possible | None | Medium | NEEDS MANUAL REVIEW |

## 4. Safe to Implement

### 4.1 Scope auth and toaster to admin routes
- Exact files:
  - `src/app/layout.tsx`
  - `src/app/(admin)/admin/layout.tsx`
  - `src/context/auth-context.tsx`
  - `src/components/ui/toaster.tsx`
- Exact reason it is safe:
  - `useAuth()` is only consumed in `src/app/(admin)/admin/layout.tsx`.
  - `toast()` calls are only present in admin pages.
  - Public routes do not consume either runtime.
- Expected performance gain:
  - Lower public bundle size.
  - Lower public hydration cost.
  - Less Firebase auth initialization on public routes.
- Expected SEO benefit:
  - Lower public JS and lower main-thread work can improve crawl rendering efficiency and Core Web Vitals.
- Implementation complexity:
  - Medium.
- Dependency on any other file:
  - Depends on preserving provider coverage for every admin route.
- Order:
  - First.

### 4.2 Remove unused root-layout header inspection
- Exact files:
  - `src/app/layout.tsx`
- Exact reason it is safe:
  - `headers()` is only used to compute `isBot`, and `isBot` is never read.
- Expected performance gain:
  - Slightly lower request overhead.
  - Cleaner static/dynamic boundary at the root.
- Expected SEO benefit:
  - Small improvement to response efficiency for crawlers.
- Implementation complexity:
  - Low.
- Dependency on any other file:
  - None.
- Order:
  - First.

### 4.3 Convert project detail content back to server-rendered output
- Exact files:
  - `src/components/portfolio/project-detail-content.tsx`
  - `src/app/work/[slug]/page.tsx`
  - `src/app/work/@modal/(.)[slug]/page.tsx`
- Exact reason it is safe:
  - The component has no state, no effect, no hook usage, and no active client-only behavior in current call sites.
  - `motion` is imported but unused.
- Expected performance gain:
  - Lower JS sent for project detail routes and modal route payloads.
  - Lower hydration cost.
- Expected SEO benefit:
  - Better crawl efficiency on project detail pages due to less client JS around the main case-study markup.
- Implementation complexity:
  - Low.
- Dependency on any other file:
  - Only its two current route consumers.
- Order:
  - First.

### 4.4 Add `sizes` to large responsive images
- Exact files:
  - `src/components/portfolio/projects.tsx`
  - `src/app/work/work-client.tsx`
  - `src/components/portfolio/project-detail-content.tsx`
  - `src/app/blog/[slug]/post-client.tsx`
- Exact reason it is safe:
  - `sizes` changes browser image selection, not rendered styling.
- Expected performance gain:
  - Smaller image transfers on mobile and tablet.
  - Lower LCP pressure on detail pages and archive cards.
- Expected SEO benefit:
  - Better image delivery can improve CWV, especially LCP.
- Implementation complexity:
  - Low.
- Dependency on any other file:
  - None.
- Order:
  - First.

### 4.5 Deduplicate repeated server fetches
- Exact files:
  - `src/app/page.tsx`
  - `src/app/work/page.tsx`
  - `src/app/blog/page.tsx`
  - `src/app/blog/[slug]/page.tsx`
  - `src/app/work/[slug]/page.tsx`
  - `src/app/sitemap.ts`
- Exact reason it is safe:
  - The same Firestore documents are read multiple times in the same request lifecycle for metadata and page content.
  - Request-scoped memoization preserves the same data and freshness semantics.
- Expected performance gain:
  - Lower server latency.
  - Fewer duplicate Firestore reads.
- Expected SEO benefit:
  - Faster metadata and document generation for crawlers.
- Implementation complexity:
  - Medium.
- Dependency on any other file:
  - Shared data helper extraction is helpful but not mandatory.
- Order:
  - Second.

### 4.6 Make the navbar scroll listener passive
- Exact files:
  - `src/components/portfolio/navbar.tsx`
- Exact reason it is safe:
  - The logic only reads `window.scrollY` and never calls `preventDefault()`.
- Expected performance gain:
  - Small reduction in scroll listener overhead.
- Expected SEO benefit:
  - Indirect only, through lower main-thread pressure.
- Implementation complexity:
  - Low.
- Dependency on any other file:
  - None.
- Order:
  - Later.

## 5. Safe Only With Conditions

### 5.1 Remove Firebase fallback imports from public components
- Condition required:
  - Every routed usage must provide the same data via server props, including blog pages, work pages, detail pages, and any fallback/default content.
- What could go wrong:
  - Missing props would change content, not just performance.
  - A route that currently relies on in-component fallback fetching could render partial data.
- How to keep UI/functionality identical:
  - Keep the exact same rendered JSX and default content.
  - Only move where the data is fetched.

### 5.2 Split Firebase into narrower modules
- Condition required:
  - Public components must import only Firestore-facing code.
  - Auth and Storage code must remain fully available to admin and server actions.
- What could go wrong:
  - Import mistakes can break admin login, uploads, or Firestore access.
- How to keep UI/functionality identical:
  - Preserve all existing APIs while changing only the module boundaries.

### 5.3 Reduce hydration on blog detail routes with smaller client islands
- Condition required:
  - The post page must preserve the same article markup, progress bar, breadcrumbs, and motion behavior.
- What could go wrong:
  - Reordering client/server boundaries can change mount timing or entry animation sequencing.
- How to keep UI/functionality identical:
  - Freeze the current DOM structure and extract only the pieces that truly need the client runtime.

### 5.4 Make sitemap freshness metadata authoritative
- Condition required:
  - Use a real timestamp source such as `updatedAt` if it actually exists in Firestore for each entity.
- What could go wrong:
  - Guessing timestamps creates incorrect crawler signals.
- How to keep UI/functionality identical:
  - Treat this as metadata-only work with no route rendering change.

## 6. Not Safe for This Project

- Lazy-loading or deferring `Hero3D`.
  - It changes the timing of the global cinematic background and risks a different first impression.
- Lazy-loading or retiming `IntroScreen`.
  - It directly changes load choreography and motion timing.
- Lazy-loading or behavior-throttling `CustomCursor`.
  - Cursor responsiveness is part of the interaction signature.
- Replacing the current font loading approach with a different strategy.
  - Font timing changes can visibly alter first paint and typography stabilization.
- Removing `force-dynamic` or introducing ISR/revalidate caching on public CMS pages.
  - That changes content freshness behavior.
- Tightening image host allowlists without a verified inventory of all current CMS asset hosts.
  - Broken remote images would be a functional regression.
- Changing animation libraries, reducing animation duration, simplifying transforms, or reducing pointer-driven motion.
  - Those all change the cinematic feel even if metrics improve.

## 7. File-by-File Plan

### `src/app/layout.tsx`
- Safe:
  - Remove unused `headers()` and bot-detection code.
  - Remove `AuthProvider` and `Toaster` from the public root if they are re-homed to admin.
- Cannot be touched freely:
  - `Hero3D` and `CustomCursor` mounting behavior.
- Why:
  - The current public visual shell is defined here.

### `src/app/page.tsx`
- Safe:
  - Deduplicate repeated Firestore reads used by both metadata and page rendering.
- Cannot be touched freely:
  - `IntroScreen`, `ScrollIndicator`, and the public section order.
- Why:
  - This file defines the home route composition and visible narrative flow.

### `src/components/portfolio/hero.tsx`
- Safe:
  - Only data-source isolation work, if the exact same props remain available.
- Cannot be touched freely:
  - Scroll transforms, motion timing, CTA behavior.
- Why:
  - Hero motion and narrative pacing are part of the visible brand.

### `src/components/portfolio/hero-3d.tsx`
- Safe:
  - No clearly safe direct optimization was confirmed without timing risk.
- Cannot be touched freely:
  - Render loop behavior, particle counts, animation cadence, interaction response.
- Why:
  - This is a primary cinematic surface.

### `src/components/portfolio/intro-screen.tsx`
- Safe:
  - Preserve current bot-skip behavior.
- Cannot be touched freely:
  - Timers, exit choreography, load sequencing.
- Why:
  - This component is almost entirely timing-sensitive.

### `src/components/portfolio/custom-cursor.tsx`
- Safe:
  - No clearly safe direct optimization was confirmed without altering feel.
- Cannot be touched freely:
  - Spring config, mount timing, pointer detection behavior.
- Why:
  - Cursor feel is visible interaction behavior.

### `src/components/portfolio/scroll-indicator.tsx`
- Safe:
  - Keep as-is unless it becomes part of a broader server/client split with identical output.
- Cannot be touched freely:
  - Motion behavior and fixed placement.
- Why:
  - Small component, but highly visible.

### `src/components/portfolio/projects.tsx`
- Safe:
  - Add `sizes`.
  - Remove fallback Firebase fetching only if server props are guaranteed everywhere.
- Cannot be touched freely:
  - Hover tilt, reveal motion, card structure, project ordering.
- Why:
  - This section is both motion-heavy and image-heavy.

### `src/components/portfolio/blog-list-client.tsx`
- Safe:
  - Very little direct optimization is needed; `sizes` is already present.
- Cannot be touched freely:
  - Hover motion, card styling, link structure.
- Why:
  - Current image hinting is already better than several other route components.

### `src/components/portfolio/modal-wrapper.tsx`
- Safe:
  - Leave routing pattern intact.
- Cannot be touched freely:
  - Dialog behavior and route-back closing pattern.
- Why:
  - That would alter user flow.

### `src/app/work/work-client.tsx`
- Safe:
  - Add `sizes` to experiment images.
  - Potentially reduce route hydration only with exact server/client boundary preservation.
- Cannot be touched freely:
  - Archive hero, experiment grid behavior, link pattern.
- Why:
  - It is route-defining public UI.

### `src/app/blog/[slug]/post-client.tsx`
- Safe:
  - Add `sizes` to the hero image.
  - Consider smaller client islands only with strict parity.
- Cannot be touched freely:
  - Progress bar behavior, entry motion, article layout.
- Why:
  - This is a content-heavy route where hydration changes can be visible.

### `src/components/portfolio/project-detail-content.tsx`
- Safe:
  - Convert to a Server Component.
  - Add `sizes` to the hero image.
- Cannot be touched freely:
  - Layout and content hierarchy.
- Why:
  - It is currently over-classified as client code.

### `src/app/sitemap.ts`
- Safe:
  - Deduplicate reads and improve timestamp sourcing if authoritative timestamps exist.
- Cannot be touched freely:
  - URL coverage.
- Why:
  - This is SEO-critical but invisible to users.

### `src/app/robots.ts`
- Safe:
  - No clear performance change needed.
- Cannot be touched freely:
  - Current crawl rules unless a separate SEO decision is made.
- Why:
  - Changes here are crawler-behavior changes, not performance wins.

### `next.config.ts`
- Safe:
  - No confirmed zero-risk change from current evidence.
- Cannot be touched freely:
  - `images.remotePatterns` allowlist behavior without a verified host inventory.
- Why:
  - A restrictive image config can break live assets.

### `src/app/globals.css`
- Safe:
  - No confirmed performance win with zero visual risk.
- Cannot be touched freely:
  - Cursor hiding rules, grain overlay, reveal animation, typography helpers.
- Why:
  - These styles are tightly tied to the site’s feel.

## 8. Priority Order

1. Move `AuthProvider` and `Toaster` out of the public root layout.
2. Remove unused `headers()` work from `src/app/layout.tsx`.
3. Convert `src/components/portfolio/project-detail-content.tsx` to a Server Component.
4. Add missing `sizes` hints to large `next/image` usages.
5. Deduplicate repeated Firestore reads across metadata and route rendering.
6. Make the navbar scroll listener passive.
7. Only after those: consider wider public Firebase bundle reduction through prop-only public components and narrower Firebase modules.

## 9. Validation Plan

- Lighthouse:
  - Compare home, work archive, blog archive, blog detail, and work detail before and after.
  - Focus on TBT, LCP, JS execution time, unused JS, and image savings.
- PageSpeed:
  - Re-run on the same public URLs and compare diagnostics for render-blocking resources and image optimization.
- Build checks:
  - Run a production build after dependencies are installed.
  - In this workspace, build verification was not completed because `node_modules` is absent and the existing `npm run build` script uses a Unix-style `NODE_ENV=production` prefix that fails on Windows PowerShell.
- Runtime checks:
  - Verify admin login, admin toast notifications, public contact submission, modal routing, and direct detail routes.
- Source verification:
  - Confirm `useAuth()` remains available on all admin pages.
  - Confirm no public component still imports broader Firebase modules unnecessarily after any bundle-isolation work.
- Screenshot comparison:
  - Compare home hero, intro, work archive, blog archive, blog detail, and work detail at desktop and mobile breakpoints.
- Route testing:
  - Test `/`, `/work`, `/work/[slug]`, modal `/work` overlay route, `/blog`, `/blog/[slug]`, `/admin/login`, and `/admin`.

## 10. Rollback Considerations

- Keep changes isolated by concern:
  - layout scoping
  - image hinting
  - server/client boundary reductions
  - fetch deduplication
- If a rollback is needed:
  - revert the layout scoping first if admin auth or toast behavior regresses
  - revert client/server boundary changes independently from image hinting
  - revert fetch memoization independently from rendering changes
- For high-sensitivity components:
  - rollback immediately if any difference appears in intro timing, cursor feel, modal behavior, or project detail rendering

## 11. Confirmed vs Inferred Findings

### Confirmed
- `src/app/layout.tsx` currently mounts `AuthProvider`, `Toaster`, `Hero3D`, and `CustomCursor` on every route.
- `useAuth()` is only used in `src/app/(admin)/admin/layout.tsx`.
- `toast()` calls are only present in admin pages.
- `src/app/layout.tsx` reads `headers()` and computes `isBot`, but the value is unused.
- `src/components/portfolio/project-detail-content.tsx` is marked `'use client'` even though current usage does not require hooks or client-only behavior.
- Large `next/image` usages in `projects.tsx`, `work-client.tsx`, `project-detail-content.tsx`, and `post-client.tsx` do not currently declare `sizes`.
- Public route files and metadata generators duplicate Firestore reads.
- `src/app/blog/page.tsx` is currently server-rendered.
- The Google Fonts URL already includes `display=swap`.
- `src/lib/firebase/config.ts` initializes app, auth, Firestore, and storage together, and that shared module is imported by public components.
- `gsap` has no confirmed source usage in `src`.
- `src/ai/genkit.ts` exists, but there is no confirmed import path from the app source into routed pages.

### Inferred
- Public bundle size is likely paying for broader Firebase surface area than necessary because public components import the shared Firebase module.
- Scoping auth/toast to admin routes should reduce public hydration and JS execution cost.
- Converting `ProjectDetailContent` to a Server Component should reduce work on project detail routes without affecting output.
- Adding `sizes` should reduce transferred image bytes on smaller breakpoints.

### Needs Manual Review
- Whether any current CMS image URLs depend on the wildcard `images.remotePatterns` configuration.
- Whether Firestore documents consistently store authoritative `updatedAt` fields for sitemap freshness.
- Whether unused packages such as `gsap`, `genkit`, `react-day-picker`, and `embla-carousel-react` are intentionally retained for planned work or dormant features.
