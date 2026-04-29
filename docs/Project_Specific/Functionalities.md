# Functionalities.md — Complete Product Functionality Reference

## Executive Summary

This document is a complete functional inventory of the Kartik Jindal portfolio and blog website. It covers every user-facing behavior, admin workflow, form interaction, routing pattern, and state management behavior present in the codebase.

The product has two distinct surfaces: a **public portfolio + blog site** and a **private admin panel**. The public site is a single-page-style portfolio with dedicated routes for a work archive, blog archive, and individual content pages. The admin panel is a full CMS with CRUD capabilities for every content section, a leads inbox, SEO management, global settings, and layout configuration.

**Completeness summary:**
- Public site: Fully functional. All sections render, animate, and link correctly.
- Blog: Read flow is complete. Write flow (admin) is complete. Subscribe and Share buttons are non-functional stubs.
- Admin CRUD: Complete for all entities (projects, blog, experience, testimonials, hero, about, contact, SEO, settings, interface, leads).
- Authentication: Complete — email/password + Google OAuth, role-based access, owner bootstrapping.
- Image uploads: Complete via AWS S3 server actions.
- Missing: No rich text editor (blog content is raw HTML/Markdown textarea), no real-time preview of public pages from admin, no pagination on blog list, no related posts, no category archive pages.

---

## 1. Public Site Functionalities

### 1.1 Intro Screen (First Load Only)

**Trigger:** Fires on every page load for non-bot, non-admin users.
**Behavior:**
- Stage 0 (0–2s): "Welcome." text fades in with blur effect
- Stage 1 (2–5s): Three phrases — "DESIGN", "BUILD", "DEPLOY" — stagger in with blur-in animation
- Stage 2 (5–8s): Entire screen slides up off-screen (`y: "-100%"`) with a custom cubic-bezier easing
- After 8s: Component unmounts from DOM entirely
- A progress bar animates from 0% to 100% over 5 seconds
- A vertical scanning line sweeps top-to-bottom over 6 seconds

**Skip conditions:**
- `pathname.startsWith('/admin')` — skipped entirely for admin routes
- `navigator.userAgent` matches bot regex — skipped for crawlers

**No skip button is provided.** Users cannot dismiss the intro early.

### 1.2 Home Page (`/`)

The home page is a single long-scroll page. All sections are stacked vertically. The page uses `export const dynamic = 'force-dynamic'` — all data is fetched server-side on every request.

**Section order:**
1. IntroScreen (overlay)
2. Navbar (fixed)
3. ScrollIndicator (fixed right, desktop only)
4. Hero
5. About
6. Projects (3 flagship)
7. Experience (conditional on `visibility.showExperience`)
8. Testimonials (conditional on `visibility.showTestimonials`)
9. Contact
10. Footer

**Conditional rendering:** The `visibility` object from `site_config/global` controls whether Experience and Testimonials sections appear. If the Firestore document doesn't exist, both default to visible.

### 1.3 Hero Section

**User actions:**
- Click "Start a Project" (primary CTA) → smooth scrolls to `#contact` section
- Click "Explore Work" (secondary CTA) → smooth scrolls to `#work` section

**Scroll behavior:** As the user scrolls past the hero, the entire content block fades out and moves upward (parallax exit). This is driven by `useScroll` + `useTransform` from Framer Motion.

**3D background:** The `Hero3D` Three.js scene is mounted globally in `layout.tsx` and is visible through the hero's transparent background. It responds to mouse movement.

### 1.4 About Section

**User actions:** None — purely informational. Skills badges have `cursor-default` and no click behavior.

**Content:** Philosophy headline, two narrative paragraphs, three pillar cards, skills badge grid, two stat counters, a quote card.

### 1.5 Projects Section (Home — 3 items)

**User actions:**
- Hover over project image → 3D tilt effect activates (desktop only, `innerWidth >= 1024`)
- Hover over project image → accent color glow bloom appears
- Click project image or "Case Study" link → navigates to `/work/[slug]` with `scroll={false}` (triggers modal on work page, full page on direct access)
- Click GitHub icon (if present) → opens external link in new tab

**Loading state:** Single pulsing dot (`w-2 h-2 rounded-full bg-primary animate-ping`) while data loads.

**Empty state:** "No flagship builds discovered yet." text in uppercase.

### 1.6 Experience Section

**User actions:** None — purely informational. The timeline line draws itself as the user scrolls through the section.

**Conditional:** Hidden entirely if `visibility.showExperience` is false or if the `experience` collection is empty.

### 1.7 Testimonials Section

**User actions:** None — purely informational. Quote icon reveals on card hover.

**Conditional:** Hidden entirely if `visibility.showTestimonials` is false or if the `testimonials` collection is empty.

### 1.8 Contact Section

**User actions:**
- Click "Start a Project" button → opens contact Dialog modal
- Inside dialog: fill form fields → submit → success state

**Contact form fields:**
- Name (min 2 chars)
- Email (valid email format)
- Subject (min 5 chars)
- Message (min 10 chars)
- Hidden honeypot field `hp` (bot detection)

**Submission flow:**
1. `react-hook-form` with `zodResolver` validates on change (`mode: "onChange"`)
2. If `hp` field is filled (bot), silently shows success without writing to Firestore
3. On valid submit: `addDoc` to `contact_leads` collection with name, email, subject, message, status: "new", createdAt, metadata (userAgent, platform)
4. Success state: CheckCircle2 icon with animate-ping ring, "Mission Received." headline
5. Auto-closes dialog after 4 seconds, resets form

**Error handling:** Toast notification with error message if Firestore write fails.

**Dialog close:** X button in header, or clicking outside the dialog (Radix Dialog `onOpenChange`).

### 1.9 Footer

**User actions:**
- Social icon links → open external profiles in new tab
- Navigation links → internal Next.js navigation
- Email address → opens `mailto:` link
- "Visit the Journal" → navigates to `/blog`
- "View Full Portfolio" → navigates to `/work`

### 1.10 Navbar

**User actions (desktop):**
- Logo "KJ." → navigates to `/`
- Nav items → navigate to respective routes/anchors
- "Start Project" button → smooth scrolls to `#contact`
- "Resume" button (if `resumeUrl` is set) → opens PDF in new tab

**User actions (mobile):**
- Hamburger icon → opens full-screen overlay menu
- Nav items in overlay → navigate and close menu
- X button → closes overlay
- "Start Project" in overlay → scrolls to contact and closes menu

**Scroll behavior:** After scrolling 50px, the nav pill gains `bg-black/40 backdrop-blur-2xl border-white/10`.

---

## 2. Blog Functionalities

### 2.1 Blog List Page (`/blog`)

**User actions:**
- Click any post card → navigates to `/blog/[slug]`
- Hover over post card → image desaturates to color, expands, horizontal line grows, arrow button inverts

**Content:** All published posts sorted by `createdAt` descending. No pagination — all posts load at once.

**Empty state:** "No articles published yet." in uppercase.

### 2.2 Blog Post Page (`/blog/[slug]`)

**User actions:**
- Scroll → reading progress bar (`h-1 bg-primary`) fills from left to right
- Click "Back to Journal" → navigates to `/blog`
- Click breadcrumb links → navigate to respective pages
- Click Share icon → **no implementation** (button renders but has no handler)
- Click Bookmark icon → **no implementation** (button renders but has no handler)
- Click "Subscribe for Updates" → **no implementation** (button renders but has no handler)

**Content rendering:** Post body is rendered via `dangerouslySetInnerHTML={{ __html: post.content }}` with `@tailwindcss/typography` prose styles applied.

**Sidebar:** Abstract summary, author name/title with initials avatar, subscribe button (non-functional).

**Slug resolution:** Tries `slug` field first, falls back to Firestore document ID. Both URLs are accessible (potential duplicate content — canonical URL mitigates for crawlers).

**404 handling:** If post not found, renders "Post not found" with a back link.

---

## 3. Work Archive Functionalities

### 3.1 Work Archive Page (`/work`)

**User actions:**
- Click flagship project image or "Case Study" → navigates to `/work/[slug]` with `scroll={false}` (triggers modal via parallel route)
- Click experiment card → navigates to `/work/[slug]` with `scroll={false}`
- Hover experiment card → image desaturates to color, Binary icon background turns primary green

**Sections:**
- Flagship Builds: Uses `Projects` component with `hideHeader` prop
- Experiments: 4-column grid of glass cards (conditional on `visibility.showExperiments`)

### 3.2 Project Detail — Modal (`/work/[slug]` from work list)

**Trigger:** Navigating to `/work/[slug]` from within the `/work` page triggers the Next.js parallel route `@modal`, rendering `ProjectDetailContent` inside a Radix `Dialog`.

**User actions:**
- Scroll within modal → custom scrollbar (`custom-scrollbar` class, 3px width)
- Click outside modal or press Escape → `router.back()` (returns to work list)
- Click GitHub icon → opens external link
- Click "Check Live" → opens live URL in new tab

**Modal constraints:** `max-h-[90vh]` with `overflow-y-auto` on the content area.

### 3.3 Project Detail — Full Page (`/work/[slug]` direct URL)

**Trigger:** Direct URL access renders the full page with Navbar, Breadcrumbs, and Footer.

**User actions:** Same as modal but without the close/back behavior. Breadcrumbs provide navigation back to `/work`.

---

## 4. Admin Panel Functionalities

### 4.1 Dashboard (`/admin`)

**Displays:**
- Live clock (updates every second via `setInterval`)
- Real-time counts: total projects, total blog posts, total leads, new leads count (fetched from Firestore on mount)
- "System Throughput" area chart with **mock data** (hardcoded `chartData` array — not real analytics)
- "Launch Pad" quick links: Deploy Project, Write Journal, Site Settings
- "Pulse Stream" activity log with **mock/static entries** (not real activity log)
- Infrastructure status badge: "S3_Firestore_Live" (static label, not a real health check)

### 4.2 Hero Editor (`/admin/hero`)

**CRUD:** Update only (no create/delete — single document `site_config/hero`).

**Editable fields:**
- Badge label text
- Title Main (solid gradient text)
- Title Highlight (outline italic text)
- Narrative subheadline/description
- Primary CTA button text
- Secondary CTA button text

**Save behavior:** `setDoc` overwrites the entire `site_config/hero` document. Toast on success/failure.

**Preview:** Live preview of CTA button styles in the right sidebar panel.

### 4.3 About Editor (`/admin/about`)

**CRUD:** Update only (single document `site_config/about`).

**Editable fields:**
- Philosophy label
- Headline Main, Headline Outline (text-outline), Headline Primary (green)
- Narrative paragraph 1 (large text)
- Narrative paragraph 2 (supporting text)
- Three core pillars: icon (dropdown from 5 options), title, description
- Skills list: add via input + Enter/button, remove via × button
- Stat 1 value + label, Stat 2 value + label
- Vision quote

### 4.4 Projects Manager (`/admin/projects`)

**List view features:**
- Search by title or type (client-side filter)
- Filter by status (all/published/draft) via Select
- Filter by type (all/FLAGSHIP/EXPERIMENT) via Select
- Per-item: thumbnail preview, title, type badge, status toggle (click to publish/draft)
- Per-item actions (visible on hover): Clone, Edit, Delete
- Multi-select with checkboxes
- Floating bulk action bar (appears when items selected): Publish All, Draft All, Purge (bulk delete)

**Create new project (`/admin/projects/new`):**

Fields:
- Title (auto-generates slug)
- Slug (manual override, validated against `^[a-z0-9-]+$`)
- Type: FLAGSHIP or EXPERIMENT
- Role, Date, Order
- Short description (`desc`)
- Long description / case study (`longDesc`)
- Methodology
- Impact quote
- Accent color (hex color picker)
- Live URL, GitHub URL
- Image: upload to S3 or paste URL directly
- Image alt text, image hint
- Tech stack: add/remove tags
- Engineering challenges: add/remove list items
- Status: draft/published
- AEO section: Quick Answer (250 char limit), Key Takeaways (add/remove), FAQs (Q&A pairs, add/remove)
- GEO section: Project Outcomes (add/remove), Hard Facts (add/remove), Source Citations (add/remove)
- SEO section: Title override (60 char counter), Meta description (160 char counter), Keywords CSV, Canonical URL, OG Image URL, Indexable toggle
- JSON-LD schema preview (collapsible, shows `SoftwareApplication` schema)
- SEO HUD sidebar: live SERP preview + social card preview + 0–100 score

**Clone:** `?clone=[id]` query param pre-fills form with source project data, appends "(Clone)" to title and "-copy" to slug, sets status to draft.

**Edit project (`/admin/projects/[id]`):** Same fields as create. Loads existing data from Firestore. Save uses `updateDoc` with `updatedAt: serverTimestamp()`.

**Delete:** `confirm()` dialog → `deleteDoc` → removes from local state.

### 4.5 Blog Manager (`/admin/blog`)

**List view features:**
- Search by title or category (client-side filter)
- Filter by status (all/published/draft)
- Per-item: categories, status toggle, title, date, read time
- Per-item actions (hover): Clone, Edit Entry, Delete
- Multi-select with checkboxes
- Floating bulk action bar: Publish, Draft, Delete

**Create new post (`/admin/blog/new`):**

Fields:
- Title (auto-generates slug)
- Slug (manual override, validated)
- Categories: add/remove tags (defaults to "Engineering")
- Display date (pre-filled with today)
- Read time (manual text field — not computed)
- Abstract summary (char counter, warns >160)
- Article body (raw HTML/Markdown textarea, `min-h-[500px]`, warns if empty)
- Image: upload to S3 or paste URL
- Image alt text, image hint
- Status: draft/published
- AEO section: Quick Answer (250 char limit), Key Takeaways (add/remove), FAQs (Q&A pairs, add/remove)
- GEO section: Hard Facts (add/remove), Source Citations (add/remove)
- SEO section: Title override, Meta description, Keywords CSV, Canonical URL, OG Image URL, Indexable toggle, "Sync with Content" button (auto-populates SEO fields from title/summary/categories)
- JSON-LD schema preview (collapsible, shows `BlogPosting` + `FAQPage` schema)
- SEO HUD sidebar

**Clone:** Same pattern as projects — `?clone=[id]` pre-fills from source.

**Edit post (`/admin/blog/[id]`):** Same fields as create. Handles legacy `category` (string) → `categories` (array) migration on load.

### 4.6 Experience Manager (`/admin/experience`)

**List view:** Ordered list by `order` field. Per-item: order number, company, role, period. Actions: Edit, Delete.

**Create/Edit (`/admin/experience/new`, `/admin/experience/[id]`):** Fields include company, role, period, description, order number.

**Delete:** `confirm()` → `deleteDoc`.

### 4.7 Testimonials Manager (`/admin/testimonials`)

**List view:** 3-column card grid. Per-card: quote preview, avatar initial, name, position. Actions: Edit, Delete.

**Create/Edit (`/admin/testimonials/new`, `/admin/testimonials/[id]`):** Fields include name, position, text (quote), avatar initial.

**Delete:** `confirm()` → `deleteDoc`.

### 4.8 Contact Module Editor (`/admin/contact`)

**CRUD:** Update only (single document `site_config/contact`).

**Editable fields:**
- Status badge text
- Headline Main + Headline Highlight
- Trigger button text
- Dialog title + subtitle
- Form field labels (name, email, subject, message)
- Form field placeholders (name, email, subject, message)

### 4.9 Leads Inbox (`/admin/leads`)

**Displays:** All contact form submissions from `contact_leads` collection, ordered by `createdAt` descending.

**Per-lead display:** Name, email, subject, message, timestamp, platform/userAgent metadata, status badge (New_Payload / Logged).

**User actions:**
- Toggle read/unread status → `updateDoc` with new status
- Delete lead → `confirm()` → `deleteDoc`

**Empty state:** "Inbox Zero." with Shield icon.

**New leads** are highlighted with `ring-1 ring-primary/30` and an animated "New_Payload" badge.

### 4.10 SEO Command (`/admin/seo`)

**Three tabs:** Home, Work, Journal.

**Home tab:** Edits `site_config/global.seo` (defaultTitle, defaultDescription, keywords, ogImage). Note: this is the global fallback, not a dedicated home page override.

**Work tab:** Edits `site_config/seo_pages.work` (title, description, keywords, ogImage).

**Journal tab:** Edits `site_config/seo_pages.blog` (title, description, keywords, ogImage).

**Each tab includes:** SEO HUD with live SERP preview, social card preview, 0–100 score, title/description length bars.

**Save:** Single "Deploy SEO" button saves all three tabs simultaneously via `setDoc` (seo_pages) + `updateDoc` (global).

### 4.11 Settings (`/admin/settings`)

**Five tabs:**

**Identity (GEO):**
- Author name (required, shown in JSON-LD Person schema)
- Job title (required)
- Entity bio (critical for GEO — used by AI engines)
- Entity readiness score (0–100% based on completeness of identity fields)

**Authority:**
- Knowledge Pillars / Expertise list (add/remove)
- Professional Credentials list (add/remove)
- Service Catalog list (add/remove)
- Entity Verification sameAs URLs (add/remove)

**Social Bridge:**
- GitHub, LinkedIn, Twitter, Instagram, Email URLs

**Assets (S3):**
- Resume PDF URL (manual input or upload to S3)
- File upload triggers `uploadToS3` server action

**Interface Toggles:**
- `showTestimonials` toggle
- `showExperience` toggle
- `showExperiments` toggle

**Save:** Single "Sync Settings" button writes entire `site_config/global` document via `setDoc`.

### 4.12 Layout Config (`/admin/interface`)

**Navbar editor:**
- Drag-to-reorder nav items via Framer Motion `Reorder.Group`
- Add new nav item (label + href)
- Edit existing item label and href inline
- Remove item

**Footer editor:**
- Brand bio textarea
- Establishment mark (EST. year)
- Drag-to-reorder footer links
- Add/edit/remove footer links

**Save:** Writes `site_config/navbar` and `site_config/footer` simultaneously.

**Live preview:** Nav items shown as pill badges in the right sidebar.

---

## 5. Authentication and Access Flow

### 5.1 Login Page (`/admin/login`)

**Two login methods:**
1. Email + password via `signInWithEmailAndPassword`
2. Google OAuth via `signInWithPopup` + `GoogleAuthProvider`

**Post-login flow:**
1. Firebase Auth signs in the user
2. `checkAdminAccess(user)` reads `users/{uid}` from Firestore
3. If document exists: checks `role` field for `ADMIN` or `SUPER_ADMIN`
4. If document does NOT exist AND email matches `OWNER_EMAIL` (`kartikjindal2003@gmail.com`): creates the document with `SUPER_ADMIN` role (bootstrapping)
5. If document does NOT exist AND email does NOT match: returns `false`
6. If access granted: toast "Welcome Commander" → `router.push('/admin')`
7. If access denied: `auth.signOut()` → toast "Access Denied"

**Error handling:** Firebase auth errors shown via toast with `error.message`.

**Loading state:** "Verifying..." button text while request is in flight.

### 5.2 Auth Context (`src/context/auth-context.tsx`)

**Wraps entire app** in `layout.tsx`. Provides `user`, `role`, `loading`, `signOut` to all components.

**`onAuthStateChanged` listener:** On every auth state change, fetches user role from `users/{uid}`. If no document exists, creates one with `SUPER_ADMIN` for owner email or `GUEST` for others.

**Role values:** `SUPER_ADMIN`, `ADMIN`, `GUEST`, `null` (unauthenticated).

### 5.3 Admin Layout Guard (`src/app/(admin)/admin/layout.tsx`)

**Protection logic:**
```
if (!loading && (!user || (role !== 'ADMIN' && role !== 'SUPER_ADMIN'))) {
  if (pathname !== '/admin/login') {
    router.push('/admin/login');
  }
}
```

**Loading state:** "AUTHENTICATING..." pulsing text while auth state resolves.

**Login page bypass:** The layout renders children directly for `/admin/login` without the sidebar/header.

**Sign out:** "Terminate Session" button → `signOut()` → `router.push('/')`.

### 5.4 Role System

| Role | Access |
|---|---|
| `SUPER_ADMIN` | Full admin panel access |
| `ADMIN` | Full admin panel access |
| `GUEST` | Redirected to login |
| `null` | Redirected to login |

There is no role-based feature differentiation between `ADMIN` and `SUPER_ADMIN` in the current UI — both have identical access.

---

## 6. Forms and Validation

### 6.1 Contact Form (Public)

**Library:** `react-hook-form` + `zod` schema validation.

**Validation mode:** `onChange` — errors appear as the user types.

**Schema:**
```
name: string, min 2 chars
email: valid email
subject: string, min 5 chars
message: string, min 10 chars
hp: string, optional (honeypot)
```

**Error display:** `text-[9px] text-destructive font-black uppercase tracking-widest` below each field. Fields with errors get `border-destructive/50 ring-1 ring-destructive/20`.

**Submit states:** "Send Transmission" → "Transmitting..." (disabled) → success state or error toast.

### 6.2 Admin Forms (General Pattern)

Admin forms use **uncontrolled local state** (`useState` with `formData` object) rather than `react-hook-form`. There is no client-side validation library in admin forms — validation is limited to:
- Required field indicators (visual only, no blocking)
- Character counters with color warnings (yellow/red)
- Slug format validation (`/^[a-z0-9-]+$/` regex with visual indicator)
- Alt text missing warning (visual only)

**No blocking validation** — admin forms can be submitted with empty required fields. The Firestore write will succeed with empty strings.

### 6.3 Login Form

**Validation:** HTML5 `required` attribute on email and password inputs. No custom validation library.

### 6.4 S3 Upload Flow

1. User selects file via `<input type="file">`
2. `handleFileUpload` creates `FormData` with file + path
3. Calls `uploadToS3(formData)` — a Next.js Server Action
4. Server action uses AWS SDK `PutObjectCommand` to upload to S3
5. Returns `{ success: true, url }` or `{ success: false, error }`
6. On success: updates `formData.image` state with S3 URL, shows success toast
7. On failure: shows destructive toast with error message

**Uploading state:** Button/overlay shows "Syncing..." while upload is in progress.


---

## 7. Routing Behavior

### 7.1 Route Map

| Route | Type | Auth | Description |
|---|---|---|---|
| `/` | Server Component | Public | Home page — all portfolio sections |
| `/work` | Server Component | Public | Work archive — flagships + experiments |
| `/work/[slug]` | Server Component | Public | Project detail — full page |
| `/work/@modal/(.)[slug]` | Parallel Route | Public | Project detail — intercepting modal |
| `/blog` | Server Component | Public | Blog archive — all published posts |
| `/blog/[slug]` | Server Component | Public | Blog post — full article |
| `/admin` | Client Component | ADMIN+ | Dashboard |
| `/admin/login` | Client Component | Public | Login page |
| `/admin/hero` | Client Component | ADMIN+ | Hero section editor |
| `/admin/about` | Client Component | ADMIN+ | About section editor |
| `/admin/projects` | Client Component | ADMIN+ | Projects list |
| `/admin/projects/new` | Client Component | ADMIN+ | Create project |
| `/admin/projects/[id]` | Client Component | ADMIN+ | Edit project |
| `/admin/experience` | Client Component | ADMIN+ | Experience list |
| `/admin/experience/new` | Client Component | ADMIN+ | Create experience |
| `/admin/experience/[id]` | Client Component | ADMIN+ | Edit experience |
| `/admin/testimonials` | Client Component | ADMIN+ | Testimonials list |
| `/admin/testimonials/new` | Client Component | ADMIN+ | Create testimonial |
| `/admin/testimonials/[id]` | Client Component | ADMIN+ | Edit testimonial |
| `/admin/contact` | Client Component | ADMIN+ | Contact module editor |
| `/admin/blog` | Client Component | ADMIN+ | Blog posts list |
| `/admin/blog/new` | Client Component | ADMIN+ | Create blog post |
| `/admin/blog/[id]` | Client Component | ADMIN+ | Edit blog post |
| `/admin/leads` | Client Component | ADMIN+ | Contact leads inbox |
| `/admin/seo` | Client Component | ADMIN+ | SEO management |
| `/admin/settings` | Client Component | ADMIN+ | Global settings |
| `/admin/interface` | Client Component | ADMIN+ | Layout configuration |
| `/sitemap.xml` | Dynamic | Public | Auto-generated sitemap |
| `/robots.txt` | Static | Public | Robots configuration |

### 7.2 Parallel Route Modal Pattern

The `/work` page uses Next.js App Router parallel routes for the project modal:

```
src/app/work/
  layout.tsx          ← renders {children} + {modal}
  page.tsx            ← work list (children)
  work-client.tsx     ← client component for work list
  @modal/
    default.tsx       ← renders null (no modal by default)
    (.)[slug]/
      page.tsx        ← intercepting modal page
  [slug]/
    page.tsx          ← full page fallback
```

**Behavior:**
- Navigating from `/work` to `/work/[slug]` → modal renders over the work list
- Direct URL access to `/work/[slug]` → full page renders (parallel route not intercepted)
- Closing modal → `router.back()` returns to work list

### 7.3 Admin Route Protection

Protection is implemented in `src/app/(admin)/admin/layout.tsx` via a `useEffect` that watches `user`, `role`, and `loading`. It is **client-side only** — there is no server-side middleware protecting admin routes. A user who knows the URL could briefly see the admin layout before being redirected.

### 7.4 Admin Page Transitions

The admin layout wraps `{children}` in `AnimatePresence` + `motion.div` with `key={pathname}`:
```tsx
initial={{ opacity: 0, y: 10 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -10 }}
transition={{ duration: 0.3 }}
```
Every admin page transition has a subtle fade + slide animation.

---

## 8. Interactive Behaviors

### 8.1 Custom Cursor (Desktop Only)

**Activation:** Only on devices where `window.matchMedia('(hover: hover)').matches` is true. Becomes visible only after the first mouse move (avoids appearing at 0,0 on load).

**Three states:**
- Default (16px white circle with `mixBlendMode: "difference"`)
- Pointer (40px) — triggers on links, buttons, `[role="button"]`
- Custom (80px with label) — triggers on elements with `data-cursor` attribute

**`data-cursor` usage:**
- Project image links: `data-cursor="View"`
- Contact trigger button: `data-cursor="Initiate"`

**Two-layer system:** Outer spring-animated circle + inner instant primary dot.

### 8.2 Scroll Indicator (Desktop Only)

Fixed right side, hidden on mobile. Shows "Progress" vertical text, a 160px track with a spring-animated primary fill bar, and 4 decorative dots that scale on hover.

### 8.3 Project Card 3D Tilt

On desktop (`innerWidth >= 1024`), hovering over a project image activates `useSpring` rotateX/Y tilt (±5 degrees, stiffness: 40, damping: 25, perspective: 1500). Mouse leave resets to 0.

### 8.4 Blog List Hover Effects

- Image: `grayscale → grayscale-0 + scale-110` (700ms transition)
- Horizontal rule: `w-8 → w-16, bg-white/20 → bg-primary` (500ms)
- Arrow button: `border-white/10 → border-primary + bg-primary + text-black` (500ms)
- Title: `text-white → text-primary`

### 8.5 Experiment Card Hover Effects

- Image: `grayscale → grayscale-0 + scale-105` (700ms)
- Binary icon container: `bg-primary/5 → bg-primary`, icon: `text-primary → text-black` (500ms)
- Card border: `border-white/5 → border-primary/30` (500ms)

### 8.6 Footer Social Icons

`whileHover: { y: -5, scale: 1.1, rotate: 5 }` — lift, scale, and slight rotation on hover.

### 8.7 Admin Sidebar

Animated width: `300px (open) ↔ 90px (collapsed)` via Framer Motion `animate`. Active nav item has `layoutId="activeNav"` for smooth indicator transition between items.

### 8.8 Admin Bulk Action Bar

Slides up from bottom of screen (`y: 100 → 0`) when items are selected, slides back down when deselected. Uses `AnimatePresence` for mount/unmount animation.

### 8.9 Blog/Project JSON-LD Preview

Collapsible section in admin editors. Click to expand/collapse with `AnimatePresence` height animation (`height: 0 → auto`). Shows formatted JSON-LD schema preview.

### 8.10 Interface Layout Drag-to-Reorder

Framer Motion `Reorder.Group` and `Reorder.Item` enable drag-to-reorder for navbar items and footer links. Items have a grip handle icon. Cursor changes to `grab`/`grabbing`.

---

## 9. State and Rendering Behavior

### 9.1 Data Fetching Strategy

| Surface | Strategy | Caching |
|---|---|---|
| Home page | Server-side `force-dynamic` | None — every request hits Firestore |
| Blog list | Server-side `force-dynamic` | None |
| Blog post | Server-side `force-dynamic` | None |
| Work archive | Server-side `force-dynamic` | None |
| Project detail | Server-side `force-dynamic` | None |
| Admin pages | Client-side `useEffect` + Firestore SDK | None |
| Navbar (SSR) | Server-side prop passed to client component | None |
| Hero/About/Contact (SSR) | Server-side `initialData` prop | None |

**Fallback pattern:** All public components accept `initialData` prop from server. If `initialData` is null/undefined, the component fetches from Firestore client-side via `useEffect`. This means data is always available on first render (SSR) but components also have a client-side fetch path as a safety net.

### 9.2 Loading States

| Component | Loading State |
|---|---|
| Projects (home) | Single pulsing dot |
| Admin dashboard | Pulsing dot |
| Admin blog list | Pulsing dot |
| Admin projects list | Spinning border circle |
| Admin experience list | Pulsing dot |
| Admin testimonials list | Pulsing dot |
| Admin leads | Pulsing dot |
| Admin hero/about/contact/settings | Pulsing dot |
| Admin blog/project editor | Pulsing dot (while fetching existing data) |
| S3 upload | "Syncing..." overlay text |
| Form submit | Button text changes to "Transmitting..." / "Syncing..." / "Initializing..." |

### 9.3 Empty States

| Component | Empty State |
|---|---|
| Projects (home) | "No flagship builds discovered yet." |
| Blog list (public) | "No articles published yet." |
| Work experiments | "The experimental lab is currently empty." |
| Admin blog list | FileText icon + "No entries found" |
| Admin projects list | Box icon + "No projects found" |
| Admin experience list | Briefcase icon + "No milestones recorded." |
| Admin testimonials | Quote icon + "No feedback captured yet." |
| Admin leads | Shield icon + "Inbox Zero." |
| Testimonials (public) | Component returns `null` (section hidden) |
| Experience (public) | Component returns `null` (section hidden) |

### 9.4 Optimistic UI Updates

Admin list pages use **optimistic local state updates** — after a successful Firestore operation, the local `useState` array is updated immediately without re-fetching:
- Delete: `setPosts(prev => prev.filter(p => p.id !== id))`
- Status toggle: `setPosts(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p))`
- Bulk operations: Same pattern applied to all selected IDs

### 9.5 Toast Notification System

All admin operations use `useToast` hook (shadcn/Radix Toast). Toasts appear in the bottom-right corner. Two variants:
- Default: success/info messages
- `destructive`: error messages with red styling

### 9.6 Conditional Section Visibility

The `visibility` object in `site_config/global` controls three public sections:
```
visibility.showTestimonials → Testimonials section
visibility.showExperience → Experience section
visibility.showExperiments → Experiments grid on /work page
```
These are toggled via Switch components in Settings → Interface Toggles tab.

---

## 10. How Blog and Portfolio Relate Functionally

### 10.1 Shared Infrastructure

Both blog and portfolio content:
- Are stored in Firebase Firestore
- Use the same admin panel authentication
- Share the same Navbar, Footer, and global 3D background
- Use the same SEO cascade system (item → page → global)
- Use the same S3 upload mechanism for images
- Share the same `site_config/global` for author identity, socials, and visibility toggles

### 10.2 Navigation Cross-Links

| From | To | Link |
|---|---|---|
| Home page | Blog | Footer "Visit the Journal", Navbar "Journal" |
| Blog list | Home | Navbar logo, Navbar links |
| Blog post | Blog list | "Back to Journal" link, breadcrumb |
| Work archive | Home | Navbar logo |
| Project detail | Work archive | Breadcrumb "Work" |
| Footer (all pages) | Blog | "Visit the Journal" CTA |
| Footer (all pages) | Work | "View Full Portfolio" CTA |

**Missing cross-links:** No links from blog posts to related projects. No links from project pages to related blog posts. No "related posts" section.

### 10.3 Content Independence

Blog posts and projects are entirely independent content types with no relational linking in Firestore. A blog post about a technology used in a project has no programmatic connection to that project.

### 10.4 Contact Section Relationship

The Contact section appears on both the home page and the blog list page. It is the same component (`Contact`) with the same Firestore-backed content. This creates a consistent conversion point across both surfaces.

---

## 11. Missing or Partial Functionalities

### 11.1 Missing — Not Implemented

| Feature | Location | Impact |
|---|---|---|
| Share button handler | Blog post footer | Medium — false affordance |
| Bookmark button handler | Blog post footer | Low — false affordance |
| Subscribe button handler | Blog post sidebar | Medium — false affordance |
| Rich text editor for blog content | Admin blog editor | High — admin must write raw HTML |
| Real analytics in dashboard | Admin dashboard | Medium — chart shows mock data |
| Real activity log | Admin dashboard | Low — "Pulse Stream" shows static entries |
| Real health check | Admin dashboard | Low — "S3_Firestore_Live" is a static label |
| Category archive pages | Public blog | Medium — no `/blog/category/[cat]` routes |
| Related posts section | Blog post page | Medium — no cross-content discovery |
| Pagination for blog list | Blog list page | Medium — all posts load at once |
| Server-side admin route protection | Admin layout | High — client-side only guard |
| `prefers-reduced-motion` support | All animations | High — accessibility gap |
| Skip intro button | IntroScreen | Medium — 8s blocking with no escape |
| Image optimization for admin previews | Admin editors | Low — uses `<img>` not `<Image>` |

### 11.2 Partial — Implemented but Incomplete

| Feature | Status | Gap |
|---|---|---|
| Blog post JSON-LD | Partial | Rendered in Client Component (indexing risk) |
| Project JSON-LD | Partial | Schema preview in admin editor but not emitted on public page |
| AEO/GEO fields | Partial | Stored in Firestore but not used in public rendering or JSON-LD output |
| Admin SEO home tab | Partial | Writes to global defaults, not a dedicated home page override |
| `readTime` field | Partial | Manual text field, not computed from content length |
| `dateModified` in BlogPosting | Partial | `updatedAt` is written to Firestore on edit but not included in JSON-LD |
| Testimonial avatars | Partial | Initials only, no real photo upload |
| Admin role differentiation | Partial | `SUPER_ADMIN` and `ADMIN` have identical UI access |
| `sameAs` in Person schema | Partial | Uses `config.socials.*` but not `identity.sameAs` array from settings |

### 11.3 Functional but Architecturally Weak

| Feature | Issue |
|---|---|
| `force-dynamic` on all public pages | No caching — every request hits Firestore |
| Admin forms have no blocking validation | Empty required fields can be saved |
| Blog content is raw HTML textarea | No WYSIWYG, no preview, XSS risk if unsanitized |
| Dashboard analytics are mock data | Misleading to any future owner/buyer |
| `confirm()` for delete operations | Browser native dialog — inconsistent with the design system |

---

## 12. Key Takeaways

1. **The admin panel is a complete, production-grade CMS.** Every public-facing content section has a corresponding admin editor. CRUD is fully implemented for all entities. The SEO HUD, AEO/GEO fields, and JSON-LD preview make it significantly more capable than a typical portfolio CMS.

2. **The public site is functionally complete.** All sections render correctly, all navigation works, the contact form submits to Firestore, and the project modal/page duality works as designed.

3. **Three public buttons are non-functional stubs.** Share, Bookmark, and Subscribe buttons in the blog post page render but have no handlers. These should either be implemented or removed before any public launch or sale.

4. **The blog content editing experience is weak.** The article body is a raw HTML/Markdown textarea with no preview, no formatting toolbar, and no sanitization on render. This is the most significant functional gap for a product being sold or handed off.

5. **Authentication is solid but client-side only.** The Firebase Auth + Firestore role system works correctly. The owner bootstrapping pattern is clever. The gap is that admin route protection is client-side only — no Next.js middleware guards the routes server-side.

6. **The AEO/GEO fields are stored but not rendered.** The admin editors have dedicated sections for Quick Answer, Key Takeaways, FAQs, Hard Facts, and Citations. These are saved to Firestore but the public pages do not render them in the HTML or in JSON-LD output. The JSON-LD preview in the admin editor is a preview only — it is not the actual schema emitted on the public page.

7. **The dashboard is cosmetic.** The analytics chart uses hardcoded mock data. The activity log shows static entries. The health check badge is a static label. The only real data on the dashboard is the four count metrics (projects, posts, leads, new leads).

8. **The product is well-structured for handoff or sale.** The separation between public site and admin panel is clean. The Firestore-backed content system means a new owner can update all content without touching code. The visibility toggles, SEO controls, and layout configuration provide meaningful non-technical control.

9. **The `force-dynamic` directive on all public pages is a performance liability.** Every page load hits Firestore. Switching to ISR with a short revalidation period would dramatically improve TTFB and Core Web Vitals without sacrificing content freshness.

10. **The product is feature-complete for a portfolio use case but not for a blog platform.** The blog lacks pagination, category archives, related posts, a rich text editor, and a reading list/bookmark system. These would need to be built before positioning this as a blog-first product.

---

*Document generated from direct codebase analysis of all route files, admin panel pages, public components, auth context, and utility files.*
