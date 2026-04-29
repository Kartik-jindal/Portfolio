# Blog SEO / AEO / GEO Audit + Plan

## Executive Summary

`/blog` and `/blog/[slug]` already have a workable SEO baseline, but the implementation is uneven. The archive route has server-side metadata, a canonical, robots control, crawlable post links, a visible `h1`, and sitemap coverage. The detail route adds item-level metadata, canonical override support, article OG type, published time, breadcrumbs UI, image alt fallback, and `BlogPosting` JSON-LD.

The biggest gap is not missing CMS fields. The admin already stores blog SEO, AEO, GEO, identity, and `sameAs` inputs in Firestore-backed editors. The main issue is public wiring: most AEO/GEO fields are collected in admin but are not emitted on `/blog/[slug]` in visible server-rendered content or richer server-side schema. The current detail-page JSON-LD is also injected from a client component, which is a risk for initial HTML visibility.

This plan therefore recommends only invisible, safe additions: metadata completion, server-rendered schema expansion, archive collection schema, breadcrumb schema, FAQ schema when data exists, and safe use of already-stored CMS fields. It explicitly avoids public UI, animation, and functionality changes.

## Present vs Missing Matrix

| Item | /blog | /blog/[slug] | Evidence | Status | Notes |
|---|---|---|---|---|---|
| Title metadata | Present | Present | `src/app/blog/page.tsx:56-61`, `src/app/blog/[slug]/page.tsx:40-47` | Present | Archive uses page-level SEO config fallback; detail uses item-level SEO fallback. |
| Description metadata | Present | Present | `src/app/blog/page.tsx:61-62`, `src/app/blog/[slug]/page.tsx:47-48` | Present | Detail falls back to `post.summary`. |
| Canonical | Present | Present | `src/app/blog/page.tsx:68-70`, `src/app/blog/[slug]/page.tsx:50-56` | Present | Detail supports CMS canonical override. |
| Robots metadata | Present | Present | `src/app/blog/page.tsx:76-79`, `src/app/blog/[slug]/page.tsx:65-67` | Present | Detail respects `seo.indexable`; archive respects `seo_pages.blog.indexable`. |
| Open Graph | Partial | Partial | `src/app/blog/page.tsx:71-75`, `src/app/blog/[slug]/page.tsx:58-63` | Partial | No explicit `url`, `siteName`, locale, or richer article properties beyond `publishedTime`. |
| Twitter metadata | Missing | Missing | No `twitter` field in either route metadata export | Missing | Admin stores OG fields, but route metadata does not emit Twitter cards. |
| Crawlable post links | Present | Present | `src/components/portfolio/blog-list-client.tsx:30`, `src/components/portfolio/breadcrumbs.tsx:21-26` | Present | Archive links to detail routes with normal `Link`. |
| Archive heading structure | Present | N/A | `src/app/blog/page.tsx:96-100`, `src/components/portfolio/blog-list-client.tsx:68` | Present | Visible intro + `h1`; cards use `h2`. |
| Detail heading structure | N/A | Present | `src/app/blog/[slug]/post-client.tsx:71`, `114` | Partial | Page `h1` exists; body headings depend on author HTML content and are not normalized. |
| Intro/snippet copy | Present | Present | `src/app/blog/page.tsx:99-101`, `src/app/blog/[slug]/post-client.tsx:135-137` | Present | Archive intro exists; detail summary is visible in sidebar. |
| Pagination / load more | Missing | N/A | Archive renders all posts via `BlogListClient` with no paging controls | Missing | Safe technical pagination can be planned, but would affect behavior and is out of scope here. |
| Categories | Present | Present | `src/components/portfolio/blog-list-client.tsx:46`, `src/app/blog/[slug]/post-client.tsx:34,59-64` | Present | Supports legacy `category` fallback. |
| Tags | Missing | Missing | No separate `tags` field in public routes or admin blog forms | Missing | Categories exist; tags do not appear to exist. |
| Related posts | Missing | Missing | No related-post query or render path found in scanned files | Missing | Safe to add only if kept invisible via schema/internal linking, but visible related modules would change UI. |
| Related projects | Missing | Missing | No cross-linking from blog detail to work routes found | Missing | Not currently wired. |
| Freshness dates | Partial | Partial | Archive cards show `post.date` in UI; detail shows `Published {post.date}` and metadata uses `createdAt` | Partial | Human date and machine date are split across `date` and `createdAt`; no `dateModified` in metadata/schema. |
| Images | Present | Present | `src/components/portfolio/blog-list-client.tsx:34-41`, `src/app/blog/[slug]/post-client.tsx:85-94` | Present | Both routes render images. |
| Alt text | Partial | Partial | Archive uses `alt={post.title}`; detail uses `alt={post.altText || post.title}`; admin captures `altText` | Partial | Archive ignores `altText`; detail uses fallback. |
| Internal links in body | Unknown | Unknown | Body HTML is injected from `post.content` via `dangerouslySetInnerHTML` | Unknown | Repo does not prove whether stored article bodies contain internal links. |
| Server-rendered visibility | Present | Partial | Route metadata is server-side; detail JSON-LD lives in client file `post-client.tsx:165-185` | Partial | Core HTML exists, but structured data is emitted from a client boundary. |
| Client-only SEO risk | Low | Medium | `post-client.tsx` is `'use client'` and emits JSON-LD | Partial | Risk is specific to schema/AEO visibility, not basic page crawlability. |
| Quick answers | Missing publicly | Missing publicly | Admin stores `aeo.quickAnswer` in blog editors; public route does not render it | In admin but not public | `src/app/(admin)/admin/blog/new/page.tsx:44,306-312`, `[id]/page.tsx:75,313-319`. |
| FAQs | Missing publicly | Missing publicly | Admin stores `aeo.faqs`; no public FAQ rendering/schema | In admin but not public | Only admin schema preview references them. |
| Summaries | Present | Present | `post.summary` on cards and detail abstract | Present | Good base for snippets, but not elevated into richer schema. |
| Key takeaways | Missing publicly | Missing publicly | Admin stores `aeo.takeaways`; no public render/schema usage | In admin but not public | Stored only in editors. |
| Author/entity data | Partial | Partial | Detail uses `config.identity.authorName` and `jobTitle`; archive metadata does not include author/entity schema | Partial | Global identity exists in settings CMS. |
| `sameAs` entity verification | Missing publicly | Missing publicly | Settings admin stores `identity.sameAs`; no public blog use found | In admin but not public | `src/app/(admin)/admin/settings/page.tsx:22,44,279-311`. |
| Expertise signals | Missing publicly | Partial | Settings admin stores bio/expertise/credentials/services; detail only shows author name/job title | In admin but not public | Strong CMS groundwork, weak public output. |
| Outcomes/facts/citations | Missing publicly | Missing publicly | Admin stores `entity.facts` and `entity.citations`; public blog pages do not use them | In admin but not public | `blog/new:43,374-396`, `blog/[id]:74,381-403`. |
| Citation-friendly structure | Partial | Partial | Summary, headings, date, author exist; facts/citations not surfaced | Partial | Good article shell, weak evidence surfacing. |
| `BlogPosting` / `Article` schema | Missing on archive | Present on detail | `src/app/blog/[slug]/post-client.tsx:165-185` | Partial | Present only on detail, and client-injected. |
| `BreadcrumbList` schema | Missing | Missing | Breadcrumb UI exists but no matching JSON-LD | Missing | Safe invisible addition. |
| `FAQPage` schema | Missing | Missing | Admin collects FAQs; public route does not emit FAQ schema | In admin but not public | Best candidate for safe invisible addition when FAQs exist. |
| `CollectionPage` / `ItemList` schema | Missing | Missing | No archive JSON-LD in `src/app/blog/page.tsx` | Missing | Safe invisible addition for archive route. |
| Sitemap coverage | Present | Present | `src/app/sitemap.ts:11-18,52-58` | Present | Includes `/blog` and published blog detail routes. |
| Robots.txt support | Present | Present | `src/app/robots.ts:16-22` | Present | Global crawl policy exists. |

## File Findings

- Path: `src/app/blog/page.tsx`
  Current role: Server route for the blog archive; fetches published posts, reads `site_config/global` and `site_config/seo_pages`, emits archive metadata, renders intro copy and `BlogListClient`.
  Gaps: No Twitter metadata; no archive schema (`CollectionPage` / `ItemList`); no author/entity/archive-level GEO signals; no proof of editable archive keywords/OG fields being fully rendered in the current blog tab UI; no pagination; no snippet-oriented archive FAQ/summary blocks beyond the intro copy.
  Safe to improve? Yes.

- Path: `src/app/blog/[slug]/page.tsx`
  Current role: Server route for single-post lookup and per-post metadata generation.
  Gaps: No Twitter metadata; no `dateModified`; no direct server-side schema emission; no use of AEO/GEO Firestore fields in metadata or schema; canonical relies on base URL env/default; `getPost` does not filter to `published` status for direct detail access.
  Safe to improve? Yes.

- Path: `src/app/blog/[slug]/post-client.tsx`
  Current role: Client-rendered post experience, including breadcrumbs UI, article body, summary sidebar, author box, and current `BlogPosting` JSON-LD script.
  Gaps: JSON-LD is client-injected; no `BreadcrumbList`; no `FAQPage`; no `sameAs`, expertise, facts, or citations in schema; no `dateModified`; no explicit internal-link enrichment; non-functional buttons remain present but must not be changed in this plan.
  Safe to improve? Partially.
  Notes: Safe only for invisible SEO/schema work; visible layout/content modules should not be changed.

- Path: `src/components/portfolio/blog-list-client.tsx`
  Current role: Renders archive cards and links to individual posts.
  Gaps: Archive image alt text uses `post.title` rather than `post.altText`; no item position metadata/schema; no snippet-specific helper copy beyond `summary`.
  Safe to improve? Partially.
  Notes: Safe for invisible data/schema support only; visible card design should stay untouched.

- Path: `src/components/portfolio/breadcrumbs.tsx`
  Current role: Client breadcrumb navigation UI for detail pages.
  Gaps: No corresponding `BreadcrumbList` schema; nav has no explicit schema tie-in.
  Safe to improve? Yes.

- Path: `src/app/(admin)/admin/blog/page.tsx`
  Current role: Blog CMS list with draft/published status management, search, bulk actions, and edit links.
  Gaps: No SEO-specific public wiring here; confirms blog content is CMS-driven.
  Safe to improve? No.
  Notes: This audit is for planning only; admin behavior should remain unchanged.

- Path: `src/app/(admin)/admin/blog/new/page.tsx`
  Current role: Blog creation form storing `seo`, `entity`, `aeo`, `altText`, `categories`, and schema preview data.
  Gaps: The stored AEO/GEO data is not proven to be consumed publicly; schema preview is editor-only; author in preview is hardcoded to `"Kartik Jindal"`.
  Safe to improve? Yes.
  Notes: Safe improvements are wiring-only, not UI changes.

- Path: `src/app/(admin)/admin/blog/[id]/page.tsx`
  Current role: Blog edit form with the same SEO/AEO/GEO structure as new post creation.
  Gaps: Same as new page; editor preview includes richer schema ideas than the public route actually emits.
  Safe to improve? Yes.

- Path: `src/app/(admin)/admin/seo/page.tsx`
  Current role: Route-level SEO CMS for global defaults and archive-level page metadata.
  Gaps: Blog archive tab visibly edits title/description, but the component state shape includes keywords/OG/indexable too; the current visible blog tab section does not expose all of those fields in the shown code.
  Safe to improve? Yes.
  Notes: Public route already reads `seo_pages.blog`; admin parity should be checked during implementation.

- Path: `src/app/(admin)/admin/settings/page.tsx`
  Current role: Global identity/entity CMS for `authorName`, `jobTitle`, `bio`, expertise, credentials, services, and `sameAs`.
  Gaps: Strong GEO source data exists, but public blog pages only use name/job title and do not consume bio, expertise, credentials, services, or `sameAs`.
  Safe to improve? Yes.

- Path: `src/app/sitemap.ts`
  Current role: Dynamic sitemap generation for archive and published post URLs.
  Gaps: Uses `createdAt` as `lastModified` fallback; no use of `updatedAt`; no enrichment issue for current audit beyond that.
  Safe to improve? Yes.

- Path: `src/app/robots.ts`
  Current role: Global robots policy with sitemap link.
  Gaps: Query-string disallow is broad; route-level metadata still handles per-page indexability separately.
  Safe to improve? No.
  Notes: Not needed for this blog-safe plan.

- Path: `src/app/layout.tsx`
  Current role: Root metadata fallback and document shell.
  Gaps: Only basic root metadata visible in this file; no direct blog-specific issue beyond fallback behavior.
  Safe to improve? No.
  Notes: Out of scope for this focused plan unless metadata fallback behavior blocks blog work.

- Path: `src/lib/firebase/config.ts` and `src/lib/firebase/firestore.ts`
  Current role: Firebase access/export layer.
  Gaps: No dedicated SEO/schema helper layer was found in `src/lib` during the scan.
  Safe to improve? Yes.
  Notes: A shared invisible helper would be a safe place for schema/metadata normalization.

- Path: `docs/**`
  Current role: Repository documentation contains prior SEO architecture and audit notes.
  Gaps: Documentation already describes some of these issues, but repo code remains the source of truth.
  Safe to improve? Yes.

## Safe Additions

- Files: `src/app/blog/page.tsx`, optional new helper under `src/lib/**`
  Change type: Add archive JSON-LD (`CollectionPage` + `ItemList`) server-side.
  Why safe: Invisible in UI and does not alter behavior.
  Benefit: Gives `/blog` a machine-readable archive structure for search and AI systems.
  Risk: Low.

- Files: `src/app/blog/page.tsx`
  Change type: Complete metadata with `twitter`, fuller OG fields, and normalized archive-level values from existing CMS data.
  Why safe: Head-only changes.
  Benefit: Better share previews and metadata parity.
  Risk: Low.

- Files: `src/app/blog/[slug]/page.tsx`, optional new helper under `src/lib/**`
  Change type: Move/duplicate structured data generation to the server route so JSON-LD is present in initial HTML.
  Why safe: Invisible, preserves page design and interactions.
  Benefit: Stronger schema reliability and crawlability.
  Risk: Low.

- Files: `src/app/blog/[slug]/page.tsx`
  Change type: Add `twitter` metadata and enrich OG/article metadata with existing post/config data.
  Why safe: Head-only changes.
  Benefit: Better item-level metadata completeness.
  Risk: Low.

- Files: `src/app/blog/[slug]/page.tsx`, `src/components/portfolio/breadcrumbs.tsx` or helper
  Change type: Add `BreadcrumbList` JSON-LD based on the existing breadcrumb trail.
  Why safe: Invisible.
  Benefit: Better hierarchy interpretation by search engines and AI systems.
  Risk: Low.

- Files: `src/app/blog/[slug]/page.tsx`
  Change type: Add conditional `FAQPage` schema using existing `aeo.faqs` only when data is present.
  Why safe: Uses existing CMS fields without changing the page layout.
  Benefit: Converts editor-entered FAQs into public machine-readable AEO signals.
  Risk: Low.

- Files: `src/app/blog/[slug]/page.tsx`
  Change type: Enrich article schema with existing `authorName`, `jobTitle`, `bio`, `sameAs`, `entity.facts`, and `entity.citations` when present.
  Why safe: Invisible reuse of existing content.
  Benefit: Better GEO/entity trust and citation-readiness.
  Risk: Low to medium.
  Notes: Must stay factual and only emit stored values.

- Files: `src/app/blog/[slug]/page.tsx`, `src/app/sitemap.ts`
  Change type: Prefer `updatedAt` for `dateModified` / `lastModified` when available, fallback to `createdAt`.
  Why safe: Metadata-only.
  Benefit: Stronger freshness signaling.
  Risk: Low.

- Files: `src/app/(admin)/admin/seo/page.tsx`, `src/app/blog/page.tsx`
  Change type: Verify and, if needed later, align blog archive CMS fields so title/description/keywords/OG/indexable exposed in admin match what the route reads.
  Why safe: No public UI change on blog pages.
  Benefit: Prevents “editable in admin but ignored in public” drift.
  Risk: Low.

- Files: `src/lib/**` optional helper
  Change type: Add a shared invisible helper for blog metadata/schema normalization.
  Why safe: Internal refactor only.
  Benefit: Reduces duplication between archive/detail route metadata and schema output.
  Risk: Low.

## Do Not Change

- Do not alter the public layout, spacing, typography, card design, sidebar structure, or any visible component styling on `/blog` or `/blog/[slug]`.
- Do not add visible FAQ blocks, takeaways sections, author bios, related posts modules, related projects modules, banners, badges, or new text blocks in the public UI.
- Do not remove or change existing motion behavior, scroll progress behavior, or page transitions.
- Do not remove existing buttons or visible affordances, even if they appear non-functional.
- Do not change archive loading behavior, routing behavior, or content model semantics as part of this safe plan.
- Do not introduce indexing behavior changes that exceed existing `indexable` controls.
- Do not assume stored Firestore fields are always populated; all new wiring must be conditional and fallback-safe.

## Implementation Plan

1. Step: Inventory and normalize blog SEO inputs.
   Files: `src/app/blog/page.tsx`, `src/app/blog/[slug]/page.tsx`, `src/app/(admin)/admin/seo/page.tsx`, `src/app/(admin)/admin/blog/[id]/page.tsx`, `src/app/(admin)/admin/settings/page.tsx`
   Objective: Confirm the exact route-level, item-level, and identity fields to consume.
   Benefit: Prevents wiring admin-only fields incorrectly.
   Validation: Compare route reads against editor save shapes for `seo`, `aeo`, `entity`, and `identity`.

2. Step: Add a small shared metadata/schema normalizer.
   Files: Optional new helper under `src/lib/**`, plus imports in the two blog route files.
   Objective: Centralize canonical/base URL handling, author/entity fallback logic, and conditional schema assembly.
   Benefit: Keeps server metadata/schema additions consistent and low-risk.
   Validation: Unit-level sanity check or route-level inspection of generated objects.

3. Step: Complete `/blog` metadata.
   Files: `src/app/blog/page.tsx`
   Objective: Add missing `twitter` metadata and normalize OG/archive metadata using existing CMS values.
   Benefit: Fuller archive metadata without visible change.
   Validation: Inspect page source/head for title, description, canonical, robots, OG, and Twitter tags.

4. Step: Add archive schema for `/blog`.
   Files: `src/app/blog/page.tsx`
   Objective: Emit `CollectionPage` + `ItemList` JSON-LD using the already-fetched published posts list.
   Benefit: Makes the archive machine-readable for SEO/AEO/GEO.
   Validation: Check page source and structured data testers for valid archive schema.

5. Step: Complete `/blog/[slug]` metadata.
   Files: `src/app/blog/[slug]/page.tsx`
   Objective: Add missing `twitter` metadata and enrich article metadata with safe fields like `dateModified` where available.
   Benefit: Better metadata coverage and freshness signaling.
   Validation: Inspect page source/head for full tag set on multiple posts.

6. Step: Move article schema responsibility to the server route.
   Files: `src/app/blog/[slug]/page.tsx`, optionally simplify `src/app/blog/[slug]/post-client.tsx` later
   Objective: Ensure `BlogPosting` JSON-LD is present in initial HTML rather than relying on a client component.
   Benefit: Safer crawl visibility.
   Validation: View raw page source and confirm JSON-LD appears before hydration.

7. Step: Expand detail-route schema with existing CMS data.
   Files: `src/app/blog/[slug]/page.tsx`
   Objective: Add conditional `BreadcrumbList`, `FAQPage`, and richer author/entity properties using `identity`, `aeo`, and `entity` when present.
   Benefit: Converts existing CMS content into public SEO/AEO/GEO signals without changing the page.
   Validation: Test posts with and without FAQs/facts/citations to verify conditional output.

8. Step: Align freshness fields.
   Files: `src/app/blog/[slug]/page.tsx`, `src/app/sitemap.ts`
   Objective: Prefer `updatedAt` for `dateModified` / `lastModified` where available.
   Benefit: More accurate freshness signals.
   Validation: Check generated values for edited vs. never-edited posts.

9. Step: Verify admin/public parity for archive SEO controls.
   Files: `src/app/(admin)/admin/seo/page.tsx`, `src/app/blog/page.tsx`
   Objective: Ensure blog archive fields editable in admin match the fields actually emitted publicly.
   Benefit: Prevents misleading CMS controls.
   Validation: Change-preview test in a safe environment and compare Firestore values to rendered metadata.

10. Step: Document fallback behavior and guardrails.
   Files: `docs/seo-audit/**`
   Objective: Record which fields are confirmed, optional, fallback-driven, or intentionally not exposed publicly.
   Benefit: Lowers future regression risk.
   Validation: Cross-check doc against final implementation diff.

## Validation Plan

- Page source
  Check `/blog` and several `/blog/[slug]` routes in raw page source, not only Elements panel.
  Confirm title, description, canonical, robots, OG, Twitter, and JSON-LD are present in initial HTML.

- Schema test
  Validate `CollectionPage` / `ItemList` on `/blog`.
  Validate `BlogPosting`, `BreadcrumbList`, and conditional `FAQPage` on `/blog/[slug]`.
  Confirm no empty arrays or blank properties are emitted.

- Lighthouse
  Re-run SEO category checks on `/blog` and `/blog/[slug]`.
  Verify no regressions in Best Practices/Performance from added schema scripts.

- Route tests
  Test published post with full `aeo` and `entity` data.
  Test published post with only basic title/summary/image fields.
  Test post with custom canonical and `indexable: false`.
  Test post using slug fallback to document ID.

- Screenshot compare
  Capture before/after screenshots of `/blog` and `/blog/[slug]`.
  Confirm there are no visible UI, motion, or behavior changes.

## Confirmed / Inferred / Unknown

### Confirmed

- `/blog` is a server route with `generateMetadata`.
- `/blog` already emits title, description, canonical, OG, and robots metadata.
- `/blog/[slug]` already emits item-level title, description, canonical, OG, and robots metadata.
- `/blog/[slug]` currently injects `BlogPosting` JSON-LD from a client component.
- Blog admin editors store `seo`, `aeo`, `entity`, `altText`, categories, and status fields.
- Global settings admin stores `authorName`, `jobTitle`, `bio`, expertise, credentials, services, and `sameAs`.
- Sitemap includes `/blog` and published blog detail URLs.

### Inferred

- The intended content model is Firestore collections `blog` and `site_config`, not local blog data files, because the scanned public and admin routes consistently read/write Firestore.
- A shared metadata/schema helper does not currently exist for blog SEO, because none was found in the scanned `src/lib` / `src/components` paths.
- The admin blog schema preview was intended to support AI/search consumption, but the public route only implements a smaller subset.

### Unknown

- Whether existing stored blog posts consistently populate `altText`, `aeo`, `entity`, and `updatedAt`.
- Whether article body HTML currently includes strong internal linking, citation markup, or snippet-friendly heading patterns.
- Whether any external monitoring or automated tests already verify metadata/schema output.
- Whether `/blog/[slug]` detail access to drafts is intentionally allowed or just an implementation gap.

## Final Recommendation

Proceed with a single safe implementation focused on invisible technical enrichment, not content redesign. The best next move is to keep the current blog UI exactly as-is while upgrading the server-side metadata and schema layer to finally use the SEO/AEO/GEO data that already exists in admin.

The highest-value sequence is: complete archive/detail metadata, move article schema to the server, add `CollectionPage`/`ItemList`, `BreadcrumbList`, and conditional `FAQPage`, then enrich author/entity schema from existing global identity and blog `entity` fields. That delivers the strongest SEO/AEO/GEO gain with the lowest product risk and stays fully inside the non-negotiables.
