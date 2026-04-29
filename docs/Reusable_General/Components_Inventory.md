# Components_Inventory.md — Complete Component Reference

## Executive Summary

This document inventories every component, hook, and utility in the codebase. It is based on direct source code inspection of all 101 files, cross-referenced with the Graphify dependency graph (252 nodes, 245 edges, 11 communities).

The codebase has three component categories: **16 portfolio domain components** (`src/components/portfolio/`), **1 admin component** (`src/components/admin/`), and **34 UI primitives** (`src/components/ui/`). Additionally, there are **2 hooks** (`src/hooks/`) and **1 utility** (`src/lib/utils.ts`).

**Key Graphify findings relevant to components:**
- `toast()` (29 edges) is the most connected node — it is the universal feedback mechanism used by every admin operation
- `useToast()` (7 edges) is the hook wrapper consumed by all admin pages
- `handleFileUpload()` appears twice as a god node (4 edges each) — confirming the S3 upload pattern is duplicated across blog and project editors
- Community 10 (cohesion 0.83) contains the auth login flow — the tightest, most self-contained component cluster

**Firebase module note:** The codebase has been refactored from a single `config.ts` to separate modules: `src/lib/firebase/app.ts`, `src/lib/firebase/firestore.ts`, `src/lib/firebase/auth.ts`, `src/lib/firebase/storage.ts`. The `config.ts` now re-exports from these. Portfolio components import `db` from `@/lib/firebase/firestore` directly.

---

## Component Categories

| Category | Count | Location | Type |
|---|---|---|---|
| Portfolio domain components | 16 | `src/components/portfolio/` | Domain |
| Admin components | 1 | `src/components/admin/` | Domain |
| UI primitives | 34 | `src/components/ui/` | UI |
| Hooks | 2 | `src/hooks/` | Utility |
| Utilities | 1 | `src/lib/utils.ts` | Utility |
| **Total** | **54** | | |

---

## Detailed Inventory

### Group 1: Portfolio Domain Components

---

#### 1.1 `Navbar`
- **File:** `src/components/portfolio/navbar.tsx`
- **Type:** Layout / Interaction-driven
- **Reusability:** Domain-specific (hardcoded brand identity "KJ.", hardcoded nav items as fallback)
- **Purpose:** Fixed top navigation bar with desktop floating pill nav and full-screen mobile overlay
- **Used in:** `/` (home), `/work`, `/blog`, `/blog/[slug]`, `/work/[slug]` — every public page
- **Props:**
  - `resumeUrl?: string` — if provided, shows a Resume button linking to the PDF
  - `navConfig?: any` — Firestore-backed nav items; falls back to hardcoded defaults if null
- **Dependencies:** `framer-motion`, `lucide-react` (Menu, X, ArrowUpRight, Plus), `next/link`, `@/lib/firebase/firestore`
- **Key implementation notes:**
  - Scroll listener adds `bg-black/40 backdrop-blur-2xl` to nav pill after 50px scroll
  - Mobile overlay uses `AnimatePresence` with staggered item entry (0.1s delay per item)
  - Falls back to Firestore fetch via `useEffect` if `navConfig` prop is null
  - `pointer-events-none` on header, `pointer-events-auto` on inner div — allows 3D background to receive events outside the nav area

---

#### 1.2 `Hero`
- **File:** `src/components/portfolio/hero.tsx`
- **Type:** Domain / Interaction-driven
- **Reusability:** Domain-specific (hardcoded fallback content with personal name)
- **Purpose:** Full-viewport hero section with scroll-driven parallax exit, badge, headline, description, and two CTAs
- **Used in:** `/` (home page only)
- **Props:**
  - `initialData?: any` — Firestore `site_config/hero` data; falls back to hardcoded defaults
- **Dependencies:** `framer-motion` (useScroll, useTransform), `@/components/ui/button`, `lucide-react` (Sparkles, ArrowRight), `@/lib/firebase/firestore`
- **Key implementation notes:**
  - `useScroll` with `offset: ["start start", "end start"]` drives `opacity: 1→0` and `y: 0→100` over first 50% of scroll
  - Primary CTA uses slide-up overlay technique: `translate-y-full → translate-y-0` on hover
  - `data-cursor="View"` not present here — that's on project cards
  - Staggered animation sequence: badge (0s), H1 (0.2s), divider (0.6s), description (1s), CTAs (1.3s)

---

#### 1.3 `Hero3D`
- **File:** `src/components/portfolio/hero-3d.tsx`
- **Type:** Interaction-driven / Visual
- **Reusability:** Moderately reusable (Three.js scene is self-contained, colors are hardcoded)
- **Purpose:** Global WebGL background — star field, node network, orbital rings, mouse-reactive
- **Used in:** `src/app/layout.tsx` — mounted globally as `fixed inset-0 z-0`, visible on ALL pages
- **Props:** None
- **Dependencies:** `three` (Three.js)
- **Key implementation notes:**
  - Scene composition: 1000 stars (Points), 10 glow halos (Sprites), 40 floating nodes (Mesh + Sprite), 4 orbital rings (TubeGeometry/TorusGeometry), dynamic connection lines (rebuilt every 120 frames)
  - Mouse reactivity: stars lerp toward mouse position (factor 0.01), rings near z=0 react with 0.003/0.002 rotation increments
  - `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))` caps pixel ratio
  - Full cleanup on unmount: disposes geometries, materials, renderer
  - Mounted div has `opacity-60` — intentionally subdued
  - **No `prefers-reduced-motion` support** — runs at full cost regardless of user preference

---

#### 1.4 `IntroScreen`
- **File:** `src/components/portfolio/intro-screen.tsx`
- **Type:** Interaction-driven / Overlay
- **Reusability:** Domain-specific (hardcoded phrases "DESIGN/BUILD/DEPLOY")
- **Purpose:** 8-second cinematic loading screen shown on home page first load
- **Used in:** `src/app/layout.tsx` — mounted globally but only renders on home page (`pathname === '/'`)
- **Props:** None
- **Dependencies:** `framer-motion`, `next/navigation` (usePathname)
- **Key implementation notes:**
  - Stage machine: 0 (Welcome, 0–2s) → 1 (Phrases, 2–5s) → 2 (Exit, 5–8s) → unmount (8s)
  - Exit animation: `y: "-100%"` with `cubic-bezier(0.85, 0, 0.15, 1)` — sharp deceleration
  - Bot detection: `navigator.userAgent` regex skips intro for crawlers (LCP optimization)
  - Admin skip: `pathname.startsWith('/admin')` — but latest source also checks `pathname === '/'`
  - Progress bar: `width: 0% → 100%` over 5s with glow shadow
  - Vertical scanning line: `top: -10% → 110%` over 6s linear

---

#### 1.5 `About`
- **File:** `src/components/portfolio/about.tsx`
- **Type:** Domain
- **Reusability:** Domain-specific (hardcoded fallback content, personal narrative)
- **Purpose:** About/philosophy section with narrative, skills badges, stats, and quote
- **Used in:** `/` (home page only)
- **Props:**
  - `initialData?: any` — Firestore `site_config/about` data
- **Dependencies:** `framer-motion`, `@/components/ui/badge`, `lucide-react` (Code2, Zap, Globe, Sparkles, Cpu), `@/lib/firebase/firestore`
- **Key implementation notes:**
  - `ICON_MAP` object maps string icon names from Firestore to Lucide components
  - 12-column grid: left col-7 (narrative + pillars), right col-5 (skills card + quote)
  - Both columns use `whileInView` with opposing x-axis entry (`x: -30` left, `x: 30` right)
  - Skills use `Badge` variant="outline" with heavy className overrides

---

#### 1.6 `Projects` + `ProjectCard`
- **File:** `src/components/portfolio/projects.tsx`
- **Type:** Domain / Interaction-driven
- **Reusability:** Moderately reusable (accepts `initialData`, `limit`, `hideHeader` props)
- **Purpose:** Flagship project showcase with alternating layout, 3D tilt, scroll-driven scale, and accent glow
- **Used in:** `/` (limit=3, with header), `/work` (hideHeader=true, all flagships)
- **Props:**
  - `initialData?: any[]` — pre-fetched projects array
  - `limit?: number` — max projects to show (0 = all)
  - `hideHeader?: boolean` — hides the "SELECTED WORKS" section header
- **Dependencies:** `framer-motion` (useScroll, useTransform, useSpring, AnimatePresence), `@/components/ui/button`, `lucide-react`, `next/image`, `next/link`, `@/lib/firebase/firestore`, `@/lib/utils` (cn)
- **Key implementation notes:**
  - `ProjectCard` is an internal sub-component (not exported separately)
  - 3D tilt: `useSpring(0, { stiffness: 40, damping: 25 })` for rotateX/Y, only on `innerWidth >= 1024`
  - Accent glow: absolutely positioned div with `backgroundColor: project.accentColor`, `blur-[80px]`, `opacity-0 → opacity-100` on hover
  - `data-cursor="View"` on image link triggers custom cursor label
  - `scroll={false}` on links triggers parallel route modal interception
  - Loading state: single pulsing dot
  - Empty state: "No flagship builds discovered yet."

---

#### 1.7 `Experience`
- **File:** `src/components/portfolio/experience.tsx`
- **Type:** Domain / Interaction-driven
- **Reusability:** Moderately reusable (no hardcoded content, accepts `initialData`)
- **Purpose:** Career timeline with sticky header and scroll-drawn vertical line
- **Used in:** `/` (home page, conditional on `visibility.showExperience`)
- **Props:**
  - `initialData?: any[]` — pre-fetched experience array
- **Dependencies:** `framer-motion` (useScroll, useTransform), `@/lib/firebase/firestore`
- **Key implementation notes:**
  - Timeline line: `motion.div` with `scaleY` driven by `scrollYProgress` mapped `[0, 0.8] → [0, 1]`, `originY: 0`
  - Square dot (not circle) at each entry: `w-5 h-5 bg-primary` with glow shadow
  - Sticky left column: `lg:sticky lg:top-32 h-fit`
  - Returns `null` if `experiences.length === 0`

---

#### 1.8 `Testimonials`
- **File:** `src/components/portfolio/testimonials.tsx`
- **Type:** Domain
- **Reusability:** Moderately reusable (no hardcoded content, accepts `initialData`)
- **Purpose:** 3-column testimonial grid with quote reveal on hover
- **Used in:** `/` (home page, conditional on `visibility.showTestimonials`)
- **Props:**
  - `initialData?: any[]` — pre-fetched testimonials array
- **Dependencies:** `framer-motion`, `lucide-react` (Quote), `@/lib/firebase/firestore`
- **Key implementation notes:**
  - Quote icon: `opacity-20 group-hover:opacity-100 transition-opacity` — reveal on hover
  - Avatar: gradient `from-primary to-accent` circle with initials (no real photo support)
  - Returns `null` if `testimonials.length === 0`
  - Uses `bg-card` (slightly lighter than background) for card surface

---

#### 1.9 `Contact`
- **File:** `src/components/portfolio/contact.tsx`
- **Type:** Domain / Form
- **Reusability:** Low (hardcoded fallback copy, Firestore write to `contact_leads`)
- **Purpose:** Contact CTA section with a Dialog form, Zod validation, honeypot, and success state
- **Used in:** `/` (home page), `/blog` (blog list page)
- **Props:**
  - `initialData?: any` — Firestore `site_config/contact` data
- **Dependencies:** `framer-motion`, `@/components/ui/button`, `@/components/ui/dialog`, `@/components/ui/input`, `@/components/ui/textarea`, `@/components/ui/label`, `react-hook-form`, `@hookform/resolvers/zod`, `zod`, `lucide-react`, `@/lib/firebase/firestore`
- **Key implementation notes:**
  - Uses `react-hook-form` + `zod` — the only public component with proper form validation
  - Honeypot field: hidden `hp` input; if filled, silently shows success without Firestore write
  - Success state: `CheckCircle2` with `animate-ping` ring, auto-closes after 4s
  - Dialog uses `AnimatePresence mode="wait"` to transition between form and success states
  - `data-cursor="Initiate"` on trigger button
  - Contact form data written to `contact_leads` collection with `status: 'new'` and metadata

---

#### 1.10 `Footer`
- **File:** `src/components/portfolio/footer.tsx`
- **Type:** Layout / Domain
- **Reusability:** Low (hardcoded brand name "Kartik Jindal." in fallback)
- **Purpose:** Site footer with brand bio, social icons, navigation links, and email CTA
- **Used in:** `/`, `/work`, `/blog`, `/blog/[slug]`, `/work/[slug]` — every public page
- **Props:**
  - `config?: any` — global config object (for `config.socials`)
  - `footerLayout?: any` — Firestore `site_config/footer` data (bio, est, footerLinks)
- **Dependencies:** `framer-motion`, `lucide-react` (Github, Twitter, Linkedin, Instagram, ExternalLink, Mail), `next/link`, `@/lib/firebase/firestore`
- **Key implementation notes:**
  - Social icons use `whileHover: { y: -5, scale: 1.1, rotate: 5 }` — Framer Motion hover
  - 12-column grid: col-4 brand, col-3 nav, col-5 contact
  - `max-w-[1700px]` — widest container on the site
  - Falls back to Firestore fetch if `footerLayout` prop is null

---

#### 1.11 `BlogListClient`
- **File:** `src/components/portfolio/blog-list-client.tsx`
- **Type:** Domain
- **Reusability:** Moderately reusable (no Firestore dependency, accepts typed `posts` array)
- **Purpose:** Renders the blog post list with grayscale hover, expanding line, and circular arrow
- **Used in:** `/blog` (blog list page)
- **Props:**
  - `posts: any[]` — pre-fetched and serialized blog posts array
- **Dependencies:** `framer-motion`, `lucide-react` (ArrowRight, Calendar, Clock, Tag), `next/link`, `next/image`
- **Key implementation notes:**
  - Image: `grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700`
  - Expanding line: `w-8 → w-16, bg-white/20 → bg-primary` on hover (500ms)
  - Arrow button: `border-white/10 → border-primary + bg-primary + text-black` on hover
  - 12-column grid per article: col-5 (image + meta), col-5 (title + summary), col-2 (arrow)
  - Empty state: "No articles published yet."
  - Separator: `absolute -bottom-6 h-px bg-white/5` between items

---

#### 1.12 `Breadcrumbs`
- **File:** `src/components/portfolio/breadcrumbs.tsx`
- **Type:** UI / Navigation
- **Reusability:** High — generic breadcrumb component, no domain knowledge
- **Purpose:** Renders a breadcrumb trail with Home as implicit root
- **Used in:** `/blog/[slug]` (post-client.tsx), `/work/[slug]` (project page)
- **Props:**
  - `items: BreadcrumbItem[]` — array of `{ label: string, href?: string }`
- **Dependencies:** `next/link`, `lucide-react` (ChevronRight), `framer-motion` (imported but not used in render)
- **Key implementation notes:**
  - Always prepends "Home" → `/` as the first item
  - Last item (no `href`) renders as `text-primary/60` span
  - `framer-motion` is imported but not actually used in the current implementation — dead import
  - `text-[10px] font-black uppercase tracking-[0.3em]` — very small, decorative style

---

#### 1.13 `CustomCursor`
- **File:** `src/components/portfolio/custom-cursor.tsx`
- **Type:** Interaction-driven / Overlay
- **Reusability:** High — self-contained, no domain knowledge, uses `data-cursor` attribute convention
- **Purpose:** Replaces the OS cursor on desktop with a spring-animated circle + primary dot
- **Used in:** `src/app/layout.tsx` — mounted globally on all pages
- **Props:** None
- **Dependencies:** `framer-motion` (useSpring, useMotionValue), `react-dom` (createPortal)
- **Key implementation notes:**
  - Portal to `document.body` at `z-[999999999]`
  - Two-layer system: outer circle (`mixBlendMode: "difference"`, spring-animated) + inner dot (instant, `bg-primary`)
  - Three variants: `default` (16px), `pointer` (40px), `custom` (80px with label text)
  - `data-cursor` attribute on any element triggers custom variant with label
  - Only activates on `window.matchMedia('(hover: hover)')` — skips touch devices
  - Becomes visible only after first mouse move (avoids appearing at 0,0)

---

#### 1.14 `ScrollIndicator`
- **File:** `src/components/portfolio/scroll-indicator.tsx`
- **Type:** Interaction-driven / UI
- **Reusability:** High — no domain knowledge, pure scroll progress visualization
- **Purpose:** Fixed right-side scroll progress bar with vertical "Progress" label and decorative dots
- **Used in:** `/` (home page only, via `src/app/page.tsx`)
- **Props:** None
- **Dependencies:** `framer-motion` (useScroll, useSpring)
- **Key implementation notes:**
  - `hidden lg:flex` — desktop only
  - Spring config: `stiffness: 100, damping: 30, restDelta: 0.001`
  - 4 decorative dots with `whileHover: { scale: 2, backgroundColor: 'var(--primary)' }`
  - Vertical text via `[writing-mode:vertical-lr] rotate-180`

---

#### 1.15 `ModalWrapper`
- **File:** `src/components/portfolio/modal-wrapper.tsx`
- **Type:** Layout / Modal
- **Reusability:** High — generic modal wrapper using Radix Dialog, no domain knowledge
- **Purpose:** Wraps project detail content in a Radix Dialog for the parallel route modal pattern
- **Used in:** `src/app/work/@modal/(.)[slug]/page.tsx`
- **Props:**
  - `children: React.ReactNode`
- **Dependencies:** `next/navigation` (useRouter), `@/components/ui/dialog`
- **Key implementation notes:**
  - `Dialog open` is always true — the modal is always open when this component renders
  - `onOpenChange={(open) => !open && router.back()}` — closing the modal navigates back
  - `DialogTitle` is `sr-only` — accessibility title hidden visually
  - `max-w-5xl rounded-[3rem] backdrop-blur-3xl cursor-none`
  - This is the critical component for the parallel route modal pattern

---

#### 1.16 `ProjectDetailContent`
- **File:** `src/components/portfolio/project-detail-content.tsx`
- **Type:** Domain
- **Reusability:** Moderately reusable (accepts `project` object, `isModal` flag)
- **Purpose:** Shared project detail layout used in both modal and full-page contexts
- **Used in:** `src/app/work/@modal/(.)[slug]/page.tsx` (isModal=true), `src/app/work/[slug]/page.tsx` (isModal=false)
- **Props:**
  - `project: any` — project data object
  - `isModal?: boolean` — controls layout constraints (max-h-[90vh] vs min-h-screen)
- **Dependencies:** `lucide-react` (Github, ArrowUpRight, ExternalLink, Target, Code, Calendar), `next/image`
- **Key implementation notes:**
  - **Not a Client Component** — no `'use client'` directive in latest source. This is a Server Component.
  - Drop-cap on first letter: `first-letter:text-5xl first-letter:font-headline first-letter:text-primary first-letter:float-left`
  - Modal mode: `max-h-[90vh] flex-col` with `overflow-y-auto custom-scrollbar` on content area
  - Full page mode: `min-h-screen pt-32 pb-24`
  - Conditional rendering: methodology, challenges, impact, liveUrl all conditional on data presence

---

### Group 2: Admin Components

---

#### 2.1 `SeoHud`
- **File:** `src/components/admin/seo-hud.tsx`
- **Type:** Domain / UI / Form
- **Reusability:** Moderately reusable (pure display component, no Firestore dependency)
- **Purpose:** Live SEO health score widget with SERP preview and social card preview
- **Used in:** `/admin/seo`, `/admin/blog/new`, `/admin/blog/[id]`, `/admin/projects/new`, `/admin/projects/[id]`
- **Props:**
  - `title?: string`
  - `description?: string`
  - `keywords?: string`
  - `ogImage?: string`
  - `url?: string` — display URL for SERP preview (defaults to `'yourdomain.com/path'`)
- **Dependencies:** `framer-motion`, `@/components/ui/progress`, `@/components/ui/tabs`, `lucide-react` (ShieldCheck, Info, AlertTriangle, CheckCircle2, Search, ExternalLink, Share2, Twitter, Linkedin)
- **Key implementation notes:**
  - Score calculation: Title (30pts) + Description (30pts) + Keywords (20pts) + OG Image (20pts) = 100 max
  - Title optimal: 50–60 chars; Description optimal: 120–160 chars; Keywords: ≥3 terms
  - Two preview tabs: Google SERP simulation + Social card simulation
  - Uses raw `<img>` for OG image preview (not Next.js `<Image>`)
  - Score displayed as `{score}/100` with primary color if >70, yellow if ≤70

---

### Group 3: UI Primitives (`src/components/ui/`)

All UI primitives are shadcn/Radix components. They are generic, unstyled-by-default, and themed via CSS variables. None have domain knowledge.

| Component | File | Radix Primitive | Used In |
|---|---|---|---|
| `Accordion` | `accordion.tsx` | `@radix-ui/react-accordion` | Not observed in active use |
| `AlertDialog` | `alert-dialog.tsx` | `@radix-ui/react-alert-dialog` | Installed, not used (should replace `window.confirm()`) |
| `Alert` | `alert.tsx` | Custom | Not observed in active use |
| `Avatar` | `avatar.tsx` | `@radix-ui/react-avatar` | Not observed in active use |
| `Badge` | `badge.tsx` | Custom | `About` component (skills), admin editors |
| `Button` | `button.tsx` | `@radix-ui/react-slot` (CVA) | Hero, Contact, Projects, all admin pages |
| `Calendar` | `calendar.tsx` | `react-day-picker` | Not observed in active use |
| `Card` | `card.tsx` | Custom | Not observed in active use |
| `Carousel` | `carousel.tsx` | `embla-carousel-react` | Not observed in active use |
| `Chart` | `chart.tsx` | `recharts` | Admin dashboard (AreaChart) |
| `Checkbox` | `checkbox.tsx` | `@radix-ui/react-checkbox` | Not observed in active use |
| `Collapsible` | `collapsible.tsx` | `@radix-ui/react-collapsible` | Not observed in active use |
| `Dialog` | `dialog.tsx` | `@radix-ui/react-dialog` | `Contact`, `ModalWrapper`, admin editors |
| `DropdownMenu` | `dropdown-menu.tsx` | `@radix-ui/react-dropdown-menu` | Not observed in active use |
| `Form` | `form.tsx` | `react-hook-form` | Not used (Contact uses RHF directly) |
| `Input` | `input.tsx` | Custom | Contact form, all admin editors |
| `Label` | `label.tsx` | `@radix-ui/react-label` | Contact form, all admin editors |
| `Menubar` | `menubar.tsx` | `@radix-ui/react-menubar` | Not observed in active use |
| `Popover` | `popover.tsx` | `@radix-ui/react-popover` | Not observed in active use |
| `Progress` | `progress.tsx` | `@radix-ui/react-progress` | `SeoHud` |
| `RadioGroup` | `radio-group.tsx` | `@radix-ui/react-radio-group` | Not observed in active use |
| `ScrollArea` | `scroll-area.tsx` | `@radix-ui/react-scroll-area` | Not observed in active use |
| `Select` | `select.tsx` | `@radix-ui/react-select` | Admin blog list, admin projects list, admin editors |
| `Separator` | `separator.tsx` | `@radix-ui/react-separator` | Not observed in active use |
| `Sheet` | `sheet.tsx` | `@radix-ui/react-dialog` | Not observed in active use |
| `Sidebar` | `sidebar.tsx` | Custom (complex) | Not observed in active use |
| `Skeleton` | `skeleton.tsx` | Custom | Not observed in active use |
| `Slider` | `slider.tsx` | `@radix-ui/react-slider` | Not observed in active use |
| `Switch` | `switch.tsx` | `@radix-ui/react-switch` | Admin settings (visibility toggles), admin blog/project editors (indexable) |
| `Table` | `table.tsx` | Custom | Not observed in active use |
| `Tabs` | `tabs.tsx` | `@radix-ui/react-tabs` | Admin SEO panel, admin settings, `SeoHud` |
| `Textarea` | `textarea.tsx` | Custom | Contact form, all admin editors |
| `Toast` | `toast.tsx` | `@radix-ui/react-toast` | Via `Toaster` component |
| `Toaster` | `toaster.tsx` | Custom wrapper | `src/app/layout.tsx`, admin layout |
| `Tooltip` | `tooltip.tsx` | `@radix-ui/react-tooltip` | Not observed in active use |


---

### Group 4: Hooks

---

#### 4.1 `useToast` / `toast`
- **File:** `src/hooks/use-toast.ts`
- **Type:** Utility hook
- **Reusability:** High — generic toast state machine, no domain knowledge
- **Purpose:** Module-level singleton toast state machine. Exports both `toast()` (callable anywhere) and `useToast()` (React hook for subscribing to state)
- **Used in:** Every admin page component (via `useToast()`), `src/components/ui/toaster.tsx` (renders the UI)
- **Graphify god node:** `toast()` has 29 edges — the highest connectivity in the entire codebase
- **Key exports:**
  - `toast({ title, description, variant? })` — callable from any context, including non-React
  - `useToast()` — returns `{ toasts, toast, dismiss }`
  - `reducer` — exported for testing
- **Key implementation notes:**
  - Module-level `memoryState` and `listeners` array — persists across React renders
  - `TOAST_LIMIT = 1` — only one toast visible at a time
  - `TOAST_REMOVE_DELAY = 1000000` — effectively never auto-removes (relies on manual dismiss)
  - This is the only truly global state in the application

---

#### 4.2 `useIsMobile`
- **File:** `src/hooks/use-mobile.tsx`
- **Type:** Utility hook
- **Reusability:** High — generic breakpoint hook
- **Purpose:** Returns `true` if viewport width is below 768px
- **Used in:** `src/components/ui/sidebar.tsx` only — not used by any portfolio component
- **Key exports:**
  - `useIsMobile(): boolean`
- **Key implementation notes:**
  - Uses `window.matchMedia` with `(max-width: 767px)`
  - Returns `false` on SSR (initial state is `undefined`, coerced to `false` via `!!`)
  - Portfolio components use Tailwind responsive classes directly instead of this hook

---

### Group 5: Utilities

---

#### 5.1 `cn`
- **File:** `src/lib/utils.ts`
- **Type:** Utility function
- **Reusability:** High — universal Tailwind class merging utility
- **Purpose:** Merges Tailwind classes with conflict resolution (clsx + tailwind-merge)
- **Used in:** `Projects` component, all shadcn UI primitives, admin pages
- **Key exports:**
  - `cn(...inputs: ClassValue[]): string`
- **Key implementation notes:**
  - `clsx` handles conditional class logic
  - `tailwind-merge` resolves Tailwind conflicts (e.g., `p-4 p-8` → `p-8`)
  - This is the standard shadcn utility pattern

---

## Reusability Assessment

### Highly Reusable (can be lifted to any project)

| Component | Why Reusable |
|---|---|
| `Breadcrumbs` | Generic `items` prop, no domain knowledge, typed interface |
| `CustomCursor` | Self-contained, uses `data-cursor` attribute convention, no domain knowledge |
| `ScrollIndicator` | Pure scroll progress visualization, no props, no domain knowledge |
| `ModalWrapper` | Generic `children` wrapper, Radix Dialog + `router.back()` pattern |
| `useToast` / `toast` | Module-level singleton, no domain knowledge, works outside React |
| `useIsMobile` | Generic breakpoint hook |
| `cn` | Universal Tailwind utility |
| All `src/components/ui/` | shadcn/Radix primitives, fully generic |

### Moderately Reusable (needs minor adaptation)

| Component | What Needs Changing |
|---|---|
| `Hero3D` | Colors are hardcoded hex values; scene parameters are hardcoded |
| `Projects` / `ProjectCard` | Firestore collection name and data shape are hardcoded |
| `Experience` | Firestore collection name hardcoded |
| `Testimonials` | Firestore collection name hardcoded |
| `BlogListClient` | Data shape (`post.slug`, `post.categories`, etc.) is hardcoded |
| `ProjectDetailContent` | Data shape is hardcoded; `isModal` prop is a good pattern |
| `SeoHud` | Scoring thresholds are hardcoded; otherwise generic |
| `IntroScreen` | Phrases "DESIGN/BUILD/DEPLOY" are hardcoded; timing is hardcoded |

### Domain-Specific (requires significant rewrite)

| Component | Why Domain-Specific |
|---|---|
| `Navbar` | Hardcoded "KJ." logo, hardcoded fallback nav items |
| `Hero` | Hardcoded personal name fallback, hardcoded CTA behavior |
| `About` | Hardcoded personal narrative fallback, hardcoded pillar icons |
| `Contact` | Hardcoded Firestore collection (`contact_leads`), hardcoded copy fallback |
| `Footer` | Hardcoded "Kartik Jindal." brand name fallback |

---

## Missing or Underused Components

### Installed but Never Used

| Component | File | Notes |
|---|---|---|
| `AlertDialog` | `src/components/ui/alert-dialog.tsx` | Should replace `window.confirm()` in all admin delete operations |
| `Accordion` | `src/components/ui/accordion.tsx` | No current use case |
| `Calendar` | `src/components/ui/calendar.tsx` | No date picker UI exists |
| `Card` | `src/components/ui/card.tsx` | Components use custom glass styling instead |
| `Carousel` | `src/components/ui/carousel.tsx` | No carousel UI exists |
| `Checkbox` | `src/components/ui/checkbox.tsx` | Admin multi-select uses custom checkbox pattern |
| `Collapsible` | `src/components/ui/collapsible.tsx` | No current use case |
| `DropdownMenu` | `src/components/ui/dropdown-menu.tsx` | No dropdown menus exist |
| `Form` | `src/components/ui/form.tsx` | Contact form uses `react-hook-form` directly |
| `Menubar` | `src/components/ui/menubar.tsx` | No menubar UI exists |
| `Popover` | `src/components/ui/popover.tsx` | No popover UI exists |
| `RadioGroup` | `src/components/ui/radio-group.tsx` | No radio group UI exists |
| `ScrollArea` | `src/components/ui/scroll-area.tsx` | Custom scrollbar CSS used instead |
| `Separator` | `src/components/ui/separator.tsx` | Custom `h-px bg-white/5` dividers used instead |
| `Sheet` | `src/components/ui/sheet.tsx` | No sheet/drawer UI exists |
| `Sidebar` | `src/components/ui/sidebar.tsx` | Admin sidebar is custom-built |
| `Skeleton` | `src/components/ui/skeleton.tsx` | Loading states use pulsing dots instead |
| `Slider` | `src/components/ui/slider.tsx` | No slider UI exists |
| `Table` | `src/components/ui/table.tsx` | No table UI exists |
| `Tooltip` | `src/components/ui/tooltip.tsx` | No tooltips exist |

### Missing Components (Expected but Not Present)

| Missing Component | Why Expected | Recommended Implementation |
|---|---|---|
| Rich text editor | Blog content is a raw HTML textarea | Tiptap or Lexical |
| `ConfirmDialog` | All deletes use `window.confirm()` | Wrap `AlertDialog` in a reusable confirm pattern |
| `ImageUpload` | S3 upload logic is duplicated in blog and project editors | Extract to a shared `<ImageUpload>` component |
| `AdminFormField` | Form field + label + error pattern is duplicated across all admin editors | Extract to a shared field wrapper |
| `StatusBadge` | Published/draft status display is duplicated across list pages | Extract to a shared badge component |
| `EmptyState` | Empty state pattern (icon + text) is duplicated across all admin list pages | Extract to a shared empty state component |
| `LoadingDot` | Pulsing dot loading state is duplicated across all admin pages | Extract to a shared loading component |
| Related posts | No related posts component exists | New component for blog post page |
| Category filter | No category filter component exists | New component for blog list page |

---

## Key Takeaways

1. **The portfolio domain components are well-structured but tightly coupled to Firestore.** Every component that fetches data has a fallback `useEffect` that reads from Firestore if `initialData` is null. This dual-fetch pattern should be eliminated — data fetching belongs in Server Components only.

2. **`toast()` is the only true cross-cutting abstraction.** Graphify confirms it with 29 edges. It is the universal feedback mechanism for all admin operations. Its module-level singleton pattern means it works outside React contexts — a genuinely useful design.

3. **`Breadcrumbs`, `CustomCursor`, `ScrollIndicator`, and `ModalWrapper` are the most reusable components.** They have no domain knowledge, clean props interfaces, and can be lifted to any project with zero modification.

4. **`Hero3D` is the most technically impressive component.** It is a complete Three.js scene with 5 distinct visual layers, mouse reactivity, and proper cleanup. It is moderately reusable — the scene parameters and colors would need to be extracted as props or config.

5. **`ProjectDetailContent` is the most architecturally clever component.** The `isModal` prop that switches between `max-h-[90vh]` and `min-h-screen` layout modes is a clean pattern for the parallel route modal/full-page duality.

6. **20 of 34 UI primitives are installed but never used.** This adds bundle weight and maintenance surface without providing value. The unused primitives should be removed or documented as available for future use.

7. **Three patterns are duplicated and should be extracted:** S3 image upload logic (appears in blog editor, project editor, and settings), form field + label + error pattern (appears in every admin editor), and empty state + loading dot pattern (appears in every admin list page).

8. **`AlertDialog` is installed but `window.confirm()` is used everywhere.** This is the most obvious component substitution opportunity — replacing all admin delete confirmations with `AlertDialog` would improve UX and accessibility with minimal effort.

9. **`framer-motion` is imported in `Breadcrumbs` but not used.** This is a dead import that adds to the component's dependency surface without providing value.

10. **The Firebase module has been refactored** from a single `config.ts` to separate files (`app.ts`, `firestore.ts`, `auth.ts`, `storage.ts`). The `config.ts` now re-exports from these. Portfolio components import `db` from `@/lib/firebase/firestore` directly — this is a cleaner pattern than the previous monolithic config.

---

*Document generated from direct source code inspection of all 54 components, hooks, and utilities, cross-referenced with Graphify dependency graph (252 nodes, 245 edges, 11 communities, god nodes: `toast()` 29 edges, `serialize()` 8 edges, `useToast()` 7 edges).*
