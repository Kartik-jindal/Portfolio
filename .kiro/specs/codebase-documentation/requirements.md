# Requirements Document

## Introduction

This feature produces 16 comprehensive technical documentation Markdown files for the Kartik Jindal cinematic portfolio codebase — a Next.js 15 App Router application with blog, admin CMS, Firebase Firestore, AWS S3, Genkit AI, Framer Motion, GSAP, and Three.js. The documentation agent acts as a senior Next.js codebase auditor, architecture analyst, UI/UX reviewer, SEO specialist, security-minded reviewer, and technical documentation writer. All documents must be grounded in the actual source code — no invented features.

The 16 output documents are split into two groups:

**Project-Specific (6 docs):** Design.md, SEO_GEO_AEO.md, Functionalities.md, Integration_Connections.md, Better_Implementation_Review.md, Scope.md

**Reusable/General (10 docs):** Architecture.md, Components_Inventory.md, Routes_Pages_Flow.md, Data_Flow.md, Performance_Accessibility_Security.md, Deployment_Setup.md, Maintenance_Handbook.md, Rebuild_and_Sell_Guide.md, Testing_Strategy.md, README.md

## Glossary

- **System**: The documentation generation system (the agent + tooling producing the 16 Markdown files).
- **Codebase**: The Kartik Jindal portfolio Next.js 15 App Router project at the workspace root.
- **Document**: One of the 16 Markdown output files.
- **Source-grounded**: Content derived exclusively from reading actual source files — not inferred or invented.
- **Inference**: A conclusion drawn from code patterns when explicit documentation is absent; must be labelled `[Inferred]`.
- **Impact Priority**: A severity label — High, Medium, or Low — applied to findings and recommendations.
- **Mermaid diagram**: A code-fenced diagram using Mermaid syntax embedded in Markdown.
- **Admin Panel**: The route group at `src/app/(admin)/admin/` providing CMS functionality.
- **Public Site**: The portfolio routes `/`, `/work`, `/work/[slug]`, `/blog`, `/blog/[slug]`.
- **Firebase**: Google Firebase services used — Auth, Firestore, Storage (imported but not actively used for uploads; AWS S3 is used instead).
- **AWS S3**: Amazon S3 bucket `kj-portfolio-bucket` in `eu-north-1` used for file uploads via `src/lib/aws/s3-actions.ts`.
- **Genkit**: Google Genkit AI SDK configured in `src/ai/genkit.ts` using `gemini-2.5-flash`.
- **SEO_GEO_AEO**: Search Engine Optimisation, Generative Engine Optimisation, and Answer Engine Optimisation.
- **RBAC**: Role-Based Access Control — roles are `SUPER_ADMIN`, `ADMIN`, `GUEST` stored in Firestore `users/{uid}`.

---

## Requirements

### Requirement 1: Source-Grounded Documentation

**User Story:** As a developer or technical stakeholder, I want every documentation file to reference actual file paths, component names, hooks, routes, and integrations from the real codebase, so that the documentation is immediately actionable and trustworthy.

#### Acceptance Criteria

1. THE System SHALL read source files before writing any documentation section.
2. WHEN a feature or pattern is described, THE System SHALL cite the specific file path (e.g., `src/components/portfolio/hero-3d.tsx`) where it is implemented.
3. IF a conclusion cannot be verified from source code, THEN THE System SHALL label it `[Inferred]` and explain the basis for the inference.
4. THE System SHALL NOT invent component names, route paths, Firestore collection names, or integration details that do not exist in the codebase.
5. WHEN referencing a Firestore collection, THE System SHALL use only collection names confirmed in source: `projects`, `blog`, `experience`, `testimonials`, `contact_leads`, `users`, `site_config`.

---

### Requirement 2: Document Structure and Quality Standards

**User Story:** As a reader of the documentation, I want each document to follow a consistent, high-quality structure with an executive summary, so that I can quickly orient myself and find relevant information.

#### Acceptance Criteria

1. THE System SHALL include an executive summary section at the top of every document.
2. THE System SHALL include a "Key Takeaways" section at the end of every document.
3. WHEN a document contains more than 3 major topics, THE System SHALL include a table of contents.
4. THE System SHALL use Mermaid diagrams where they add clarity — specifically for architecture flows, data flows, route trees, and component hierarchies.
5. THE System SHALL use Markdown tables to present structured data such as component inventories, route lists, environment variables, and Firestore schemas.
6. THE System SHALL prioritise findings and recommendations using the labels: **High**, **Medium**, or **Low** impact.
7. THE System SHALL keep boundaries clean between documents — each document covers its defined scope without heavy duplication of content from other documents.

---

### Requirement 3: Design.md — Visual Design System Documentation

**User Story:** As a designer or developer, I want a complete record of the visual design system, so that I can maintain visual consistency when extending the codebase.

#### Acceptance Criteria

1. THE System SHALL document the colour palette from `src/app/globals.css` HSL CSS variables: `--background`, `--foreground`, `--primary` (HSL 161 94% 45%), `--accent`, `--card`, `--muted`, `--destructive`, `--border`, `--ring`.
2. THE System SHALL document the typography system: `Playfair Display` (font-headline, loaded via Google Fonts in `src/app/layout.tsx`) and `PT Sans` (font-body).
3. THE System SHALL document the glassmorphism utility classes defined in `globals.css`: `.glass`, `.glass-accent`.
4. THE System SHALL document the cinematic text utilities: `.text-outline`, `.text-outline-primary`, `.text-gradient`.
5. THE System SHALL document the noise overlay pattern (`.bg-grain`) and its usage in `src/app/layout.tsx` and the admin layout.
6. THE System SHALL document the custom scrollbar styles and the `cursor: none` override applied at `lg:` breakpoint.
7. THE System SHALL document the animation vocabulary: Framer Motion scroll-driven transforms in `hero.tsx` and `projects.tsx`, the `IntroScreen` stage sequence in `src/components/portfolio/intro-screen.tsx`, and the Three.js scene in `src/components/portfolio/hero-3d.tsx`.
8. THE System SHALL document the Radix UI / shadcn component theme configuration from `components.json` and the CSS variable mapping.
9. WHEN documenting the Three.js scene, THE System SHALL describe the five scene layers: star field, glow halos, node network, connection lines, and ring system.

---

### Requirement 4: SEO_GEO_AEO.md — Search, Generative, and Answer Engine Optimisation

**User Story:** As a site owner or SEO specialist, I want a complete audit of all SEO, GEO, and AEO implementations, so that I can understand what is in place and what gaps remain.

#### Acceptance Criteria

1. THE System SHALL document the `robots.ts` configuration: allow `/`, disallow `/admin/`, `/admin/*`, `/*?*`, and the sitemap reference.
2. THE System SHALL document the `sitemap.ts` implementation: static routes (`/`, `/work`, `/blog`) plus dynamic routes from Firestore `projects` and `blog` collections with their `changeFrequency` and `priority` values.
3. THE System SHALL document the `generateMetadata()` functions in `src/app/page.tsx`, `src/app/work/page.tsx`, `src/app/work/[slug]/page.tsx`, `src/app/blog/page.tsx`, and `src/app/blog/[slug]/page.tsx`, including the Firestore sources and fallback chains.
4. THE System SHALL document the JSON-LD structured data: the `Person` schema in `src/app/page.tsx` and the `BlogPosting` schema in `src/app/blog/[slug]/post-client.tsx`.
5. THE System SHALL document the GEO fields in the admin settings page: `identity.authorName`, `identity.jobTitle`, `identity.bio`, `identity.expertise`, `identity.services`, `identity.credentials`, `identity.sameAs`.
6. THE System SHALL document the AEO fields in the blog and project CMS editors: `aeo.quickAnswer`, `aeo.takeaways`, `aeo.faqs`, and the `entity.facts`, `entity.citations` fields.
7. THE System SHALL document the `SeoHud` component scoring algorithm: title (30pts), description (30pts), keywords (20pts), OG image (20pts).
8. THE System SHALL document the bot-detection logic in `src/app/layout.tsx` and `src/components/portfolio/intro-screen.tsx`.
9. THE System SHALL identify SEO gaps and label each finding with High, Medium, or Low impact.

---

### Requirement 5: Functionalities.md — Complete Feature Inventory

**User Story:** As a product owner or new developer, I want a complete inventory of every user-facing and admin-facing feature, so that I understand the full scope of what the system does.

#### Acceptance Criteria

1. THE System SHALL document all public-facing features: cinematic intro screen, 3D WebGL background, custom cursor, scroll progress indicator, hero section, about section, projects showcase (FLAGSHIP and EXPERIMENT types), experience timeline, testimonials grid, contact form with dialog, footer with social links, blog list, blog post detail, work archive, project detail (page and modal).
2. THE System SHALL document all admin CMS features: dashboard with stats and mock chart, hero editor, about editor, projects CRUD, experience CRUD, testimonials CRUD, contact module editor, blog CRUD with AEO/GEO fields, SEO command panel, layout/interface editor with drag-reorder, leads inbox, global settings.
3. THE System SHALL document the authentication flow: Firebase Auth `onAuthStateChanged`, role lookup from `users/{uid}`, SUPER_ADMIN bootstrap for the owner email, redirect to `/admin/login` for unauthenticated users.
4. THE System SHALL document the contact form honeypot spam protection field `hp` in `src/components/portfolio/contact.tsx`.
5. THE System SHALL document the project clone feature (`?clone=id` query param) available in both blog and project new-entry pages.
6. THE System SHALL document the parallel intercepting route modal pattern for project detail at `src/app/work/@modal/(.)[slug]/page.tsx`.
7. THE System SHALL document the visibility toggles (`showTestimonials`, `showExperience`, `showExperiments`) from `site_config/global`.

---

### Requirement 6: Integration_Connections.md — External Service Integrations

**User Story:** As a DevOps engineer or backend developer, I want a complete map of all external service integrations, so that I can manage credentials, debug failures, and plan migrations.

#### Acceptance Criteria

1. THE System SHALL document the Firebase integration: SDK initialisation in `src/lib/firebase/config.ts`, services exported (`auth`, `db`, `storage`), all environment variables, and the `getApps()` singleton guard.
2. THE System SHALL document the AWS S3 integration: `src/lib/aws/s3-actions.ts` as a Next.js Server Action, `S3Client` configuration, `PutObjectCommand` usage, bucket `kj-portfolio-bucket`, region `eu-north-1`, public URL construction pattern, and the three upload paths.
3. THE System SHALL document the Genkit AI integration: `src/ai/genkit.ts` configuration with `googleAI()` plugin and `gemini-2.5-flash` model, the `src/ai/dev.ts` development entry point, and the npm scripts.
4. THE System SHALL document the Google Fonts integration: `Playfair Display` and `PT Sans` loaded via `<link>` tags in `src/app/layout.tsx` with `preconnect` hints.
5. THE System SHALL document the `apphosting.yaml` Firebase App Hosting configuration.
6. THE System SHALL note that `firebase/storage` is imported but file uploads use AWS S3 exclusively — Firebase Storage is unused for uploads. Label this `[Inferred: potential dead import]`.
7. THE System SHALL document all environment variables in a table with columns: Variable, Scope (client/server), Purpose, Required.

---

### Requirement 7: Better_Implementation_Review.md — Improvement Recommendations

**User Story:** As a senior developer or tech lead, I want a prioritised list of specific, actionable improvement recommendations grounded in the actual code, so that I can plan a technical debt reduction roadmap.

#### Acceptance Criteria

1. THE System SHALL identify `typescript.ignoreBuildErrors: true` and `eslint.ignoreDuringBuilds: true` in `next.config.ts` as a High-impact issue.
2. THE System SHALL identify the wildcard `images.remotePatterns` (`hostname: '**'`) in `next.config.ts` as a Medium-impact security concern.
3. THE System SHALL identify the absence of Firestore Security Rules in the codebase as a High-impact security gap.
4. THE System SHALL identify the hardcoded `OWNER_EMAIL` constant in `src/context/auth-context.tsx` as a Medium-impact maintainability issue.
5. THE System SHALL identify the mock/static chart data in `src/app/(admin)/admin/page.tsx` as a Low-impact issue.
6. THE System SHALL identify the `any` type usage across admin pages as a Medium-impact type-safety issue.
7. THE System SHALL identify the absence of rate limiting on the contact form Firestore write as a High-impact security issue.
8. THE System SHALL identify the absence of error boundaries in public page components as a Medium-impact reliability issue.
9. THE System SHALL identify `force-dynamic` on key pages and recommend ISR as a performance improvement.
10. THE System SHALL identify missing `sizes` props on `next/image` usages as a Medium-impact performance issue.
11. WHEN presenting recommendations, THE System SHALL format each as: Issue, File Reference, Impact (High/Medium/Low), Recommended Fix.

---

### Requirement 8: Scope.md — Project Scope Definition

**User Story:** As a project manager or stakeholder, I want a clear definition of what is in scope and out of scope for this codebase, so that I can set accurate expectations.

#### Acceptance Criteria

1. THE System SHALL document what is in scope: the public portfolio site, the admin CMS, Firebase Auth/Firestore integration, AWS S3 file management, Genkit AI scaffolding, SEO/GEO/AEO tooling, and the 16 documentation files.
2. THE System SHALL document what is out of scope: email notification system, real-time analytics (dashboard chart uses mock data), Firebase Storage uploads (AWS S3 is used instead), multi-user admin collaboration, and a full resume builder.
3. THE System SHALL document the current deployment targets: Firebase App Hosting and Vercel.
4. THE System SHALL document the known constraints from `docs/00-system-audit-and-constraints.md`: protected files and the STRICT DO NOT CHANGE list.

---

### Requirement 9: Architecture.md — System Architecture

**User Story:** As a developer onboarding to the project, I want a clear architectural overview with diagrams, so that I can understand how the system is structured before reading individual files.

#### Acceptance Criteria

1. THE System SHALL produce a Mermaid diagram showing the high-level architecture: Browser, Next.js App Router, Firebase Firestore, AWS S3, and Genkit AI.
2. THE System SHALL document the Next.js App Router route group structure: `(admin)` group with its own layout, public routes, and the parallel intercepting route for work modals.
3. THE System SHALL document the rendering strategy per route: `force-dynamic` on home, work, and blog list pages; server components for data fetching; client components for animations.
4. THE System SHALL document the global layout layers in `src/app/layout.tsx`: Three.js background (z-0), noise overlay (z-1), content (z-10), custom cursor (z-[999999999]).
5. THE System SHALL document the data hydration pattern: server-side initial data passed as props, client-side `useEffect` fallback fetch from Firestore when `initialData` is absent.
6. THE System SHALL document the `serialize()` utility function pattern used across server components to convert Firestore Timestamps.
7. THE System SHALL document the authentication architecture: `AuthProvider` wrapping the entire app, `useAuth()` hook, role-based redirect in the admin layout.

---

### Requirement 10: Components_Inventory.md — Component Catalogue

**User Story:** As a developer, I want a complete inventory of all components with their props, responsibilities, and dependencies, so that I can quickly find and reuse components.

#### Acceptance Criteria

1. THE System SHALL catalogue all portfolio components in `src/components/portfolio/` with file path, props, Firestore collections read, animation libraries used, and Server/Client Component designation.
2. THE System SHALL catalogue all admin components in `src/components/admin/`.
3. THE System SHALL catalogue all UI primitives in `src/components/ui/` as a table listing component name and its Radix UI primitive source.
4. THE System SHALL document the `CustomCursor` three variants: default (16px), pointer (40px), custom (80px with label from `data-cursor` attribute).
5. THE System SHALL document the `Hero3D` five Three.js scene layers and mouse-reactive rotation behaviour.
6. THE System SHALL document the `IntroScreen` three-stage sequence and the bot/admin skip logic.

---

### Requirement 11: Routes_Pages_Flow.md — Route and Navigation Map

**User Story:** As a developer or QA engineer, I want a complete map of all routes, their data sources, and navigation flows, so that I can test and extend the application confidently.

#### Acceptance Criteria

1. THE System SHALL produce a Mermaid diagram of the complete route tree including the `(admin)` route group and the `@modal` parallel route.
2. THE System SHALL document each public route in a table: Route, File, Rendering Mode, Firestore Collections Read, Metadata Source.
3. THE System SHALL document each admin route in a table: Route, File, Auth Required, Firestore Collections Read/Written.
4. THE System SHALL document the navbar navigation items and their targets, noting they are configurable via `site_config/navbar`.
5. THE System SHALL document the parallel intercepting route pattern for project modals.
6. THE System SHALL document the slug-with-ID-fallback lookup pattern used in project and blog detail pages.

---

### Requirement 12: Data_Flow.md — Data Flow Documentation

**User Story:** As a backend developer, I want a complete map of how data flows from Firestore through the application to the UI, so that I can debug data issues and plan schema changes.

#### Acceptance Criteria

1. THE System SHALL produce a Mermaid sequence diagram showing the home page data flow: parallel Firestore fetches, Timestamp serialisation, prop passing, and client-side fallback.
2. THE System SHALL document all Firestore collections and their document schemas as confirmed from source code, including extended fields: `blog.aeo`, `blog.entity`, `blog.seo`, `projects.aeo`, `projects.entity`, `projects.seo`, `site_config/global.identity`.
3. THE System SHALL document the contact form data flow: Zod validation, honeypot check, `addDoc` to `contact_leads` with metadata.
4. THE System SHALL document the S3 upload data flow: file selection, FormData construction, Server Action call, PutObjectCommand, URL storage in Firestore.
5. THE System SHALL document the SEO data flow: global defaults, per-page overrides, per-item overrides — with the fallback chain for each.
6. THE System SHALL document the `site_config` document map: `global`, `hero`, `about`, `navbar`, `footer`, `contact`, `seo_pages` — each with key fields.

---

### Requirement 13: Performance_Accessibility_Security.md

**User Story:** As a senior engineer, I want a thorough audit of performance, accessibility, and security posture, so that I can prioritise hardening work.

#### Acceptance Criteria

1. THE System SHALL document performance characteristics: `force-dynamic` disabling caching, Three.js pixel ratio cap at 2, star count of 1000, connection line update throttled to every 120 frames, bot detection skipping intro animation.
2. THE System SHALL document the `next/image` usage audit: components using `fill` with `object-cover`, components missing `sizes` prop, and the wildcard `remotePatterns`.
3. THE System SHALL document accessibility concerns: `cursor: none` at `lg:` breakpoint, custom cursor only on `(hover: hover)` devices, absence of `aria-label` on icon-only admin sidebar buttons.
4. THE System SHALL document security findings: AWS credentials as server-side env vars (correct), Firebase public vars (expected), absence of Firestore Security Rules, no CSRF protection on Server Actions, no rate limiting on contact form, `ignoreBuildErrors: true`.
5. THE System SHALL document the honeypot field as the sole spam protection mechanism.
6. WHEN documenting each finding, THE System SHALL assign an impact label: High, Medium, or Low.

---

### Requirement 14: Deployment_Setup.md — Deployment and Environment Guide

**User Story:** As a DevOps engineer or developer setting up the project, I want a complete deployment and environment setup guide, so that I can get the application running without guesswork.

#### Acceptance Criteria

1. THE System SHALL document all required environment variables in a table with columns: Variable, Scope, Purpose, Example Value, Required.
2. THE System SHALL document the npm scripts from `package.json`: `dev` (Turbopack on port 9002), `build`, `start`, `lint`, `typecheck`, `genkit:dev`, `genkit:watch`.
3. THE System SHALL document the Firebase App Hosting deployment path via `apphosting.yaml`.
4. THE System SHALL document the Vercel deployment path as referenced in `BACKEND_GUIDE.md`.
5. THE System SHALL document the AWS S3 bucket setup: bucket name, region, public read policy, IAM permissions.
6. THE System SHALL document the Genkit AI setup and the Google AI API key requirement.
7. THE System SHALL document the `components.json` shadcn configuration.

---

### Requirement 15: Maintenance_Handbook.md — Operational Maintenance Guide

**User Story:** As a developer maintaining the site, I want a practical handbook for common maintenance tasks, so that I can perform updates safely and efficiently.

#### Acceptance Criteria

1. THE System SHALL document how to add a new project via `/admin/projects/new`.
2. THE System SHALL document how to add a new blog post via `/admin/blog/new` with AEO fields.
3. THE System SHALL document how to update the resume via `/admin/settings` Assets tab.
4. THE System SHALL document how to update SEO metadata via `/admin/seo`.
5. THE System SHALL document how to manage contact leads via `/admin/leads`.
6. THE System SHALL document how to toggle section visibility via `/admin/settings` Interface tab.
7. THE System SHALL document the protected files list that must not be modified.
8. THE System SHALL document the Firestore Timestamp serialisation requirement for server components.

---

### Requirement 16: Rebuild_and_Sell_Guide.md — White-Label Rebuild Guide

**User Story:** As a developer who wants to resell or rebuild this template for clients, I want a guide explaining customisation points and white-labelling steps, so that I can efficiently adapt the codebase.

#### Acceptance Criteria

1. THE System SHALL document the customisation entry points in `site_config`: `global`, `hero`, `about`, `navbar`, `footer`, `contact`, `seo_pages`.
2. THE System SHALL document the design token swap points: HSL CSS variables in `globals.css`, Google Fonts link in `layout.tsx`.
3. THE System SHALL document the OWNER_EMAIL bootstrap mechanism and how to change it for a new client.
4. THE System SHALL document the AWS S3 bucket swap via environment variables.
5. THE System SHALL document the Firebase project swap via `NEXT_PUBLIC_FIREBASE_*` environment variables.
6. THE System SHALL document the domain configuration via `NEXT_PUBLIC_BASE_URL`.
7. THE System SHALL document the Genkit AI model swap in `src/ai/genkit.ts`.

---

### Requirement 17: Testing_Strategy.md — Testing Approach

**User Story:** As a QA engineer or developer, I want a documented testing strategy that reflects the current state of the codebase and recommends a practical path to test coverage.

#### Acceptance Criteria

1. THE System SHALL document the current state of testing: no test files exist in the codebase (no `*.test.ts`, `*.spec.ts`, `__tests__` directories, no test runner in `package.json` devDependencies).
2. THE System SHALL recommend a testing stack: Vitest for unit/integration tests, Playwright for end-to-end tests, React Testing Library for component tests.
3. THE System SHALL identify the highest-value unit test targets: `uploadToS3`, role assignment logic in `auth-context.tsx`, the `serialize()` utility, the `slugify()` function, and the `SeoHud` score calculation.
4. THE System SHALL identify the highest-value integration test targets: contact form submission, admin authentication redirect, Firestore data fetch and serialisation.
5. THE System SHALL identify the highest-value end-to-end test targets: public site navigation, blog post rendering, project detail modal, admin login and CRUD.
6. THE System SHALL document property-based testing candidates: the `serialize()` Timestamp conversion (round-trip property) and the `slugify()` function (output always matches `^[a-z0-9-]+$`).

---

### Requirement 18: README.md — Project README

**User Story:** As a developer encountering this project for the first time, I want a clear, professional README that gives me everything I need to understand, set up, and run the project.

#### Acceptance Criteria

1. THE System SHALL include a project title, one-line description, and technology badge list (Next.js 15, TypeScript, Tailwind CSS, Firebase, AWS S3, Framer Motion, Three.js, Genkit).
2. THE System SHALL include a prerequisites section: Node.js 18+, a Firebase project, an AWS S3 bucket, and a Google AI API key.
3. THE System SHALL include a quick-start section with commands: clone, `npm install`, copy `.env.local` template, `npm run dev`.
4. THE System SHALL include the complete `.env.local` template with all required variables and placeholder values.
5. THE System SHALL include a project structure overview of the `src/` directory.
6. THE System SHALL include links to the other 15 documentation files.
7. THE System SHALL include a deployment section referencing both Firebase App Hosting and Vercel options.
