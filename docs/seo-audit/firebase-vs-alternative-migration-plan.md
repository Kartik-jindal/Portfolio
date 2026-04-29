# Firebase Replacement / Retention Audit

Repository evidence date: 2026-04-30.
External pricing and platform-fit checks were verified against official vendor docs on 2026-04-30.

## 1. Executive Summary

- Current Firebase dependency level: medium. Firebase is live for authentication, role lookup/bootstrap, Firestore-backed CMS/content reads, Firestore-backed lead capture, and admin CRUD. Firebase Storage is configured but not the active media pipeline.
- Recommended decision: partially replace Firebase, not fully replace it.
- Best recommended target stack for this repository: keep Firebase Auth and Firestore for now, add Firebase Admin SDK with server-side session cookies for admin protection, keep AWS S3 as the storage layer, and only consider a later database/auth migration if CMS/query complexity outgrows Firestore.
- Main risks:
  - current admin protection is client-side only because there is no middleware, no route handler auth boundary, and no server-side session enforcement
  - docs still describe Firebase Storage as active, but code routes uploads through AWS S3, so some architectural docs are stale
  - full replacement of auth and content DB would touch SEO-sensitive public rendering, slug routing, metadata generation, sitemap generation, and all admin CRUD paths
- Main benefits of the recommended path:
  - lowest regression risk
  - preserves current public routes and admin UX
  - avoids unnecessary migration cost while fixing the most important security gap
  - keeps the stack cheap enough for a portfolio/CMS workload

## 2. Current Firebase Usage Map

| Capability | File path(s) | What it does | Live | Essential | Safe to replace |
|---|---|---|---|---|---|
| Firebase app bootstrap | `src/lib/firebase/config.ts` | Initializes Firebase app and exports `auth`, `db`, `storage` | Yes | Yes | Partially |
| Firebase Auth login | `src/app/(admin)/admin/login/page.tsx` | Email/password and Google popup admin login | Yes | Yes | Not safely in one step |
| Auth state context | `src/context/auth-context.tsx` | Tracks signed-in user with `onAuthStateChanged`, loads role from Firestore, bootstraps owner record | Yes | Yes | Medium-risk |
| RBAC storage | `src/context/auth-context.tsx`, `src/app/(admin)/admin/login/page.tsx` | Uses `users/{uid}` documents with `SUPER_ADMIN`, `ADMIN`, `GUEST` | Yes | Yes | Medium-risk |
| Admin route protection | `src/app/(admin)/admin/layout.tsx` | Redirects unauthorized users on client after auth state resolves | Yes | Yes | Replace only with stronger server protection |
| Firestore public homepage data | `src/app/page.tsx` | Reads `site_config`, `projects`, `experience`, `testimonials` for public rendering and metadata | Yes | Yes | High-risk to replace quickly |
| Firestore blog archive/detail | `src/app/blog/page.tsx`, `src/app/blog/[slug]/page.tsx` | Reads published blog content and SEO config | Yes | Yes | High-risk to replace quickly |
| Firestore work archive/detail | `src/app/work/page.tsx`, `src/app/work/[slug]/page.tsx`, `src/app/work/@modal/(.)[slug]/page.tsx` | Reads published projects and global SEO data | Yes | Yes | High-risk to replace quickly |
| Firestore sitemap generation | `src/app/sitemap.ts` | Builds blog/work URLs from Firestore content | Yes | Yes | High-risk to replace quickly |
| Firestore lead capture | `src/components/portfolio/contact.tsx`, `src/app/(admin)/admin/leads/page.tsx` | Creates `contact_leads` and lets admin review/update/delete them | Yes | Important | Yes, but not first |
| Firestore admin CMS CRUD | `src/app/(admin)/admin/**` | Creates, updates, deletes site config, blog posts, projects, experience, testimonials, leads | Yes | Yes | High-risk to replace quickly |
| Firebase Storage | `src/lib/firebase/config.ts` | `getStorage(app)` is initialized only | Configured only | No | Yes |
| Firebase Storage env/config surface | `.env.local`, docs, `src/lib/firebase/config.ts` | `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` and related docs remain present | Configured only | No | Yes |
| Messaging/App identity config | `.env.local`, `src/lib/firebase/config.ts` | `messagingSenderId`, `appId` passed into Firebase config | Configured only | No | Yes |
| Firebase Admin SDK | docs only, `package-lock.json` transitive mention | Planned or transitively present, but not imported by app source | No | Would be valuable | Safe to add |
| Firebase Analytics / FCM / Functions / Remote Config / App Check / Performance / Crashlytics | no source imports found | Not implemented in repo source | No | No current dependency | Safe to ignore or add later |

Evidence notes:

- `src/app/(admin)/admin/login/page.tsx` performs `signInWithEmailAndPassword`, `signInWithPopup`, then checks Firestore role access.
- `src/context/auth-context.tsx` auto-creates a `users/{uid}` document and assigns `SUPER_ADMIN` to the designated owner email.
- `src/app/(admin)/admin/layout.tsx` is the only auth gate and it is client-side.
- `src/components/portfolio/contact.tsx` writes leads directly from the browser to Firestore.
- `src/lib/aws/s3-actions.ts` is the actual upload path for files, not Firebase Storage.

## 3. What Firebase Is Actually Doing Well

- Firestore currently maps well to this repository’s content model: `site_config`, `projects`, `blog`, `experience`, `testimonials`, `contact_leads`, and `users`.
- Public SEO-critical pages already fetch content server-side from Firestore in App Router pages, which preserves crawlable HTML.
- Slug-based blog/work routing and sitemap generation are already wired against Firestore content and working within the current app structure.
- Firebase Auth already supports both admin login methods the repo uses: email/password and Google sign-in.
- The current RBAC model is simple and understandable: auth identity plus Firestore role document.
- For current portfolio-scale traffic, Firebase can stay inside a generous low-cost envelope if reads/writes remain modest.

## 4. What Firebase Is Overkill For

- Firebase Storage is overkill in this repo because it is not the live asset pipeline anymore. S3 already handles uploads for blog, projects, and resume assets.
- Initializing `storage` inside the shared Firebase client config is unnecessary for public pages that only need Firestore.
- Carrying Firebase client auth state for admin-only access, without server-side session enforcement, gives the complexity of auth without the full security benefit.
- Real-time database behavior is not being used. Firestore is currently used as a request/CRUD store, not as a live-sync feature.
- Messaging sender ID and app identity config are present, but no messaging feature exists in app source.
- Several docs still assume a more Firebase-centric backend than the code actually uses. Current code is already a hybrid Firebase + S3 system.

## 5. Replacement Options Compared

Scoring basis: 1 to 10, higher is better for this exact repository under these priorities: cheapest possible stack, generous free tier, strong engineering control, minimal regression risk, public route safety, and admin login support.

| Option | Cost / free tier | Next.js fit | SEO friendliness | Admin login fit | RBAC fit | Engineering control | Migration difficulty | Lock-in risk | Recommendation score |
|---|---|---|---|---|---|---|---|---|---|
| Firebase as currently used | Good on low traffic; Spark and no-cost products are strong for small projects, but Firestore and storage quotas are finite | Good | Good | Medium | Medium | Medium | None | Medium-high | 7/10 |
| Supabase | Strong free tier for small apps; single platform bundles Postgres, Auth, Storage | Strong | Strong | Strong | Strong via RLS | Strong | High for this repo because auth + DB + content model all move | Medium | 8/10 for greenfield, 6/10 for this repo now |
| Postgres + Prisma + Auth.js | Potentially cheap but depends on host choice; Auth.js itself is free and open source | Strong | Strong | Strong | Strong | Very strong | Very high because multiple layers must be introduced and migrated | Low-medium | 7/10 for long-term control, 5/10 for this repo now |
| Clerk + DB | Free tier is good for auth alone, but becomes additive cost beside DB/storage | Very strong for auth | Strong | Very strong | Medium unless paired with app-level role model | Medium | Medium-high because auth stack changes while DB still remains | Medium-high | 6/10 |
| Keep Firebase + Admin SDK | Cheapest safe improvement because it preserves current DB/auth and only hardens sessions | Strong enough | Strong | Strong | Stronger than current | Medium-strong | Low-medium | Medium-high | 9/10 |

Platform-fit notes from official vendor docs checked on 2026-04-30:

- Firebase official pricing/docs confirm Spark no-cost usage plus separate quotas for Firestore, Storage, and other paid-tier products, while Auth, App Check, FCM, Performance, Remote Config, and some other products can be no-cost depending on usage and product category.
- Supabase official docs confirm a Free Plan with two free projects, 500 MB database size per project, 1 GB storage, 50,000 MAU, and strong Next.js App Router SSR/Auth guidance.
- Clerk official docs confirm strong Next.js App Router support and a free Hobby tier for small apps, but Clerk only solves auth, not this repo’s content DB.
- Auth.js official docs confirm it is free and open source, but it would still need a database/session strategy and would not reduce migration complexity by itself.

## 6. Best Recommendation for This Project

Decision: partially replace Firebase.

What that means in this repository:

- Keep Firebase Auth for now.
- Keep Firestore for now.
- Keep AWS S3 as the active storage layer.
- Add Firebase Admin SDK with server-side session cookies and server-side role checks for admin access.
- Do not migrate the public CMS/content database in the near term.
- Do not introduce a full auth replacement in the near term.

Why:

- The active Firebase footprint is real but focused. It is not large enough to justify a full platform migration when the top repo risk is security posture, not feature mismatch.
- The public site, metadata generation, blog/work slug routing, sitemap generation, lead capture, and admin CRUD all depend on Firestore today.
- Firebase Storage is already effectively replaced by S3, so the repo is already in a sensible partial-replacement state.
- The highest-value correction is not a new vendor. It is server-side auth enforcement.

What to replace first:

- Replace client-only admin session enforcement with Firebase Admin SDK session cookies and server-checked admin access.

What to keep:

- Firestore collections and document shapes.
- Existing public content fetch patterns.
- Existing admin login UX and role model.
- Existing S3 media upload path.

What to add later:

- Optional analytics platform after deciding whether product analytics or traffic analytics matter more.
- Optional lead notification automation.
- Optional App Check or equivalent abuse protection if public write traffic grows.

## 7. Safe Migration Plan

### Phase 1

- Preserve Firebase Auth and Firestore exactly as current public/admin functionality expects.
- Add server-side session handling for admin login using Firebase Admin SDK session cookies.
- Add server-side admin protection for `/(admin)/admin` routes.
- Keep the current login page, admin flow, route structure, and role semantics unchanged.

Verification after Phase 1:

- `/admin/login` still supports email/password and Google login.
- `/admin` and nested admin routes reject unauthorized access before page content is served.
- existing public routes render identically.
- no change to sitemap, metadata, slug routing, or design.

### Phase 2

- Formalize the storage split: Firebase Storage remains unused, S3 remains active.
- Remove architectural dependence on Firebase Storage from planning docs and future design assumptions.
- Optionally narrow Firebase client imports so public paths only import Firestore-facing code where needed.

Verification after Phase 2:

- blog/project/resume uploads still use S3.
- all public images and asset URLs still resolve.
- admin media flows remain unchanged.

### Phase 3

- Re-evaluate whether Firestore should remain the CMS DB or whether a future Postgres-based content model is justified.
- Only consider DB migration if one of these becomes true:
  - relational reporting becomes important
  - content volume grows enough that query flexibility is blocked by Firestore patterns
  - you want one platform for auth, DB, storage, and server-side policy control

Verification after Phase 3:

- public route HTML, metadata, slug behavior, sitemap coverage, lead capture, and admin CRUD all remain identical before any DB cutover is considered.

What stays unchanged visually and functionally across all phases:

- layouts
- animations
- motion timing
- public route composition
- admin information architecture
- content schema as observed by the UI

## 8. Components / Areas That Must Not Be Broken

- `/`
- `/work`
- `/work/[slug]`
- modal work route `src/app/work/@modal/(.)[slug]/page.tsx`
- `/blog`
- `/blog/[slug]`
- `/admin/login`
- `/admin` and all nested admin routes
- `generateMetadata()` behavior in public pages
- `src/app/sitemap.ts`
- `src/app/robots.ts`
- Firestore published-content filtering
- Firestore slug lookup fallback behavior
- `contact_leads` creation and admin review flow
- role bootstrap behavior for designated owner login

## 9. SEO / GEO / AEO Impact

SEO:

- Keeping Firestore for now is safer than replacing the content backend because metadata generation, sitemap generation, and public content rendering already depend on it.
- Adding server-side admin auth has near-zero direct SEO risk because admin routes are not public acquisition surfaces, but it materially improves system correctness.
- Full DB migration would be SEO-sensitive because it touches page data reads, route params, published filters, and sitemap content population.

GEO:

- The repo’s public content must remain stable, reachable, and semantically consistent for search and answer engines.
- Any migration that changes content availability, timestamps, slugs, or published filters could degrade discoverability.

AEO:

- Answer-engine visibility depends on stable blog/work content, metadata, structured content continuity, and no accidental route regressions.
- A safe auth hardening path improves backend quality without risking answer-surface regressions.

Crawlability:

- Current public App Router pages already fetch content on the server, which is favorable for crawlable output.
- Replacing the content source without perfect parity would be riskier than retaining Firestore.

Metadata:

- `src/app/page.tsx`, `src/app/blog/page.tsx`, `src/app/blog/[slug]/page.tsx`, `src/app/work/page.tsx`, and `src/app/work/[slug]/page.tsx` all depend on Firestore-backed config or content.
- Any content-source migration must preserve title, description, keywords, canonical URL, OG image, and indexability logic exactly.

Performance:

- Replacing Firebase is not the primary performance win here.
- Performance is more likely to improve through server-auth hardening, narrower client imports, fewer duplicate reads, and public bundle isolation than through a platform rewrite.

## 10. Risk Assessment

Low risk items:

- Add Firebase Admin SDK.
- Add server-side session cookies for admin auth.
- Keep S3 as the live storage path.
- Treat Firebase Storage as non-critical.

Medium risk items:

- Narrow Firebase client import boundaries.
- Move lead capture away from direct browser Firestore writes to a server-owned path.
- Introduce analytics platform changes.

High risk items:

- Replacing Firestore as the source of truth for public content.
- Replacing Firebase Auth outright before server-side enforcement is fixed.
- Migrating blog/work slug routing or sitemap data source without strict parity validation.

Items to avoid for now:

- full Supabase migration
- full Postgres + Prisma + Auth.js migration
- Clerk-first auth replacement while Firestore content still remains unchanged
- any rewrite that changes current route structure, admin flow, or content rendering behavior

## 11. Final Verdict

Firebase should not be fully replaced in this repository now.

Best decision: partially replace Firebase by keeping the active, working pieces that already match the codebase, while hardening the weak point and keeping the already-better storage choice.

In practice, that means:

- keep Firestore
- keep Firebase Auth
- keep S3 for storage
- add Firebase Admin SDK and server-side session enforcement
- postpone any DB/auth platform migration until there is a stronger reason than “possible future neatness”

Reasoning:

- This path is cheapest.
- This path has the lowest regression risk.
- This path preserves SEO-sensitive public rendering.
- This path preserves admin login and current functionality.
- This path improves engineering correctness where the repo is actually weak today.

## 12. File Reference Index

Repository files that materially influenced this recommendation:

- `src/lib/firebase/config.ts`
- `src/context/auth-context.tsx`
- `src/app/(admin)/admin/login/page.tsx`
- `src/app/(admin)/admin/layout.tsx`
- `src/app/(admin)/admin/page.tsx`
- `src/app/(admin)/admin/about/page.tsx`
- `src/app/(admin)/admin/blog/page.tsx`
- `src/app/(admin)/admin/blog/new/page.tsx`
- `src/app/(admin)/admin/blog/[id]/page.tsx`
- `src/app/(admin)/admin/projects/page.tsx`
- `src/app/(admin)/admin/projects/new/page.tsx`
- `src/app/(admin)/admin/projects/[id]/page.tsx`
- `src/app/(admin)/admin/experience/page.tsx`
- `src/app/(admin)/admin/experience/new/page.tsx`
- `src/app/(admin)/admin/experience/[id]/page.tsx`
- `src/app/(admin)/admin/testimonials/page.tsx`
- `src/app/(admin)/admin/testimonials/new/page.tsx`
- `src/app/(admin)/admin/testimonials/[id]/page.tsx`
- `src/app/(admin)/admin/contact/page.tsx`
- `src/app/(admin)/admin/leads/page.tsx`
- `src/app/(admin)/admin/interface/page.tsx`
- `src/app/(admin)/admin/seo/page.tsx`
- `src/app/(admin)/admin/settings/page.tsx`
- `src/app/page.tsx`
- `src/app/blog/page.tsx`
- `src/app/blog/[slug]/page.tsx`
- `src/app/work/page.tsx`
- `src/app/work/[slug]/page.tsx`
- `src/app/work/@modal/(.)[slug]/page.tsx`
- `src/app/sitemap.ts`
- `src/app/robots.ts`
- `src/app/layout.tsx`
- `src/components/portfolio/contact.tsx`
- `src/components/portfolio/about.tsx`
- `src/components/portfolio/hero.tsx`
- `src/components/portfolio/navbar.tsx`
- `src/components/portfolio/footer.tsx`
- `src/components/portfolio/projects.tsx`
- `src/components/portfolio/experience.tsx`
- `src/components/portfolio/testimonials.tsx`
- `src/lib/aws/s3-actions.ts`
- `package.json`
- `next.config.ts`
- `BACKEND_GUIDE.md`
- `docs/01-data-model-rbac-storage.md`
- `docs/02-auth-rbac-access.md`
- `docs/04-public-wiring-and-seo.md`
- `docs/Project_Specific/Functionalities.md`
- `docs/seo-audit/safe-performance-plan.md`
- `docs/seo-audit/admin-panel-fact-base.md`
- `docs/seo-audit/verification-functionality.md`
- `graphify-out/GRAPH_REPORT.md`
- `graphify-out/graph.json`

Official external references used for cost/platform-fit verification:

- Firebase pricing and pricing-plan docs: https://firebase.google.com/pricing and https://firebase.google.com/docs/projects/billing/firebase-pricing-plans
- Firebase Admin session cookies: https://firebase.google.com/docs/auth/admin/manage-cookies
- Supabase pricing and Next.js/Auth docs: https://supabase.com/docs/guides/platform/billing-on-supabase , https://supabase.com/docs/guides/getting-started/quickstarts/nextjs , https://supabase.com/docs/guides/auth/quickstarts/nextjs
- Clerk pricing and Next.js docs: https://clerk.com/pricing , https://clerk.com/docs/quickstarts/nextjs
- Auth.js overview: https://authjs.dev/
