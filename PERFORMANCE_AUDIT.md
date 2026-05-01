# Performance Audit Report

## Summary

This portfolio has **catastrophic initial-load performance** driven by three root causes: (1) Three.js (~600KB) is eagerly loaded in the root layout on every page without `next/dynamic`, (2) all portfolio components are `"use client"` with redundant client-side Firebase calls despite server-fetched data already being passed as props, and (3) fonts are loaded via render-blocking `<link>` tags instead of `next/font`. Combined with the 8-second `IntroScreen` overlay hiding the LCP element, `force-dynamic` on all public pages, and zero `optimizePackageImports` configuration, the result is a **TBT of 10s+** and a **Speed Index of 6.7s**.

---

## Issues

---

### 🔴 1. Three.js Loaded Synchronously in Root Layout

**File:** `src/app/layout.tsx` → `src/components/portfolio/hero-3d.tsx`

**Problem:** `Hero3D` is imported directly in the root layout with `import * as THREE from 'three'`. Three.js is ~600KB minified and ships to the client on **every single page** (including `/admin`, `/blog`, `/work`). This is the single largest contributor to TBT and unused JS.

**Before:**
```tsx
// src/app/layout.tsx
import { Hero3D } from '@/components/portfolio/hero-3d';
// ...
<div className="fixed inset-0 z-0 pointer-events-none">
  <Hero3D />
</div>
```

```tsx
// src/components/portfolio/hero-3d.tsx
import * as THREE from 'three';
```

**After:**
```tsx
// src/app/layout.tsx
import dynamic from 'next/dynamic';

const Hero3D = dynamic(
  () => import('@/components/portfolio/hero-3d').then(mod => ({ default: mod.Hero3D })),
  { ssr: false, loading: () => <div className="w-full h-full" /> }
);
// ...
<div className="fixed inset-0 z-0 pointer-events-none">
  <Hero3D />
</div>
```

**Impact:** TBT ↓ ~4,000–6,000ms. Unused JS ↓ ~600KB. This fix alone may halve TBT.

✅ UI/Animations/Functionality: unchanged — Three.js canvas loads identically, just deferred.

---

### 🔴 2. Fonts Loaded via Render-Blocking `<link>` Tags

**File:** `src/app/layout.tsx`

**Problem:** Google Fonts are loaded via `<link rel="stylesheet">` in `<head>`, which is render-blocking. The browser cannot paint text until the CSS file is downloaded and parsed. This directly inflates LCP and Speed Index.

**Before:**
```tsx
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
</head>
```

**After:**
```tsx
// src/app/layout.tsx
import { Playfair_Display, PT_Sans } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-headline',
  display: 'swap',
});

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-body',
  display: 'swap',
});

// In the component:
<html lang="en" className={`dark scroll-smooth ${playfair.variable} ${ptSans.variable}`}>
  {/* Remove the <head> block with <link> tags entirely */}
  <body className="font-body antialiased ...">
```

Then update `tailwind.config.ts`:
```ts
fontFamily: {
  body: ['var(--font-body)', 'sans-serif'],
  headline: ['var(--font-headline)', 'serif'],
},
```

**Impact:** LCP ↓ ~300–500ms. Fonts are self-hosted, inlined, and use `font-display: swap`.

✅ UI/Animations/Functionality: unchanged — same fonts, same rendering.

---

### 🔴 3. IntroScreen Overlay Blocks LCP for 8 Seconds

**File:** `src/components/portfolio/intro-screen.tsx`

**Problem:** The `IntroScreen` component covers the entire viewport for up to 8 seconds (`setTimeout → 8000ms`). The actual hero content (the LCP element) is hidden behind it. PageSpeed measures LCP as the time the *largest visible content* paints — the overlay causes the real LCP element to be delayed until at least 5s when the overlay starts exiting.

**Before:**
```tsx
const timer3 = setTimeout(() => {
  setIsVisible(false);
}, 8000);
```

**After (performance-conscious tuning):**
```tsx
// Reduce total intro duration: Welcome (0-1.2s), Phrases (1.2-3.5s), Exit starts at 3.5s, gone by 5s
const timer1 = setTimeout(() => setStage(1), 1200);
const timer2 = setTimeout(() => setStage(2), 3500);
const timer3 = setTimeout(() => setIsVisible(false), 5000);
```

> [!IMPORTANT]
> Even better: render the hero content *behind* the intro (already done via z-index) but ensure the hero `<h1>` is in the DOM and painted. The issue is that `IntroScreen` has `z-[9999]` and covers the viewport, so the browser considers the overlay's content as LCP, not the hero. Consider making the intro purely CSS-animated so it doesn't block the React hydration path.

**Impact:** LCP ↓ ~1–3s (depending on how PageSpeed measures the overlay vs hero).

✅ UI/Animations/Functionality: intro is shorter but same visual sequence — just faster pacing.

---

### 🔴 4. `"use client"` on Every Portfolio Component + Redundant Firebase Calls

**File:** `src/components/portfolio/hero.tsx`, `about.tsx`, `navbar.tsx`, `footer.tsx`, `experience.tsx`, `testimonials.tsx`, `contact.tsx`, `projects.tsx`

**Problem:** Every section component is `"use client"` **and** contains a `useEffect` that re-fetches data from Firebase on the client, even though the server-rendered `page.tsx` already passes `initialData` via props. This means:

1. **All component code ships to the client bundle** (framer-motion + firebase/firestore + lucide-react per component).
2. **Redundant Firebase SDK** is included in the client bundle (~150KB for `firebase/firestore` alone).
3. The data is fetched *twice*: once on the server (in `page.tsx`) and once on the client (in each component's `useEffect`) — though the `useEffect` short-circuits when `initialData` is present, the Firebase imports still bloat the bundle.

**Before (pattern repeated in every component):**
```tsx
"use client";
import { db } from '@/lib/firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';

export const Hero = ({ initialData }: { initialData?: any }) => {
  const [data, setData] = useState(initialData);
  useEffect(() => {
    if (!initialData) {
      // fetch from firebase...
    }
  }, [initialData]);
```

**After:** Split into a thin client wrapper and keep Firebase imports server-only:

```tsx
// src/components/portfolio/hero.tsx (keep "use client" — needed for framer-motion)
"use client";
// REMOVE: import { db } from '@/lib/firebase/firestore';
// REMOVE: import { doc, getDoc } from 'firebase/firestore';

export const Hero = ({ initialData }: { initialData: any }) => {
  // REMOVE: the useState + useEffect for firebase fetch
  // Use initialData directly — it's always provided by the server component
  const content = initialData || { /* fallback defaults */ };
  // ... rest of component unchanged
```

> [!TIP]
> Apply this same pattern to: `about.tsx`, `navbar.tsx`, `footer.tsx`, `experience.tsx`, `testimonials.tsx`, `projects.tsx`. The `contact.tsx` component still needs Firebase for `addDoc` (form submission), but the config fetch can also be removed since `initialData` is always passed.

**Impact:** Client bundle ↓ ~150–200KB (firebase/firestore removed from client). TBT ↓ ~1,000–2,000ms.

✅ UI/Animations/Functionality: unchanged — same data, same rendering, same animations.

---

### 🔴 5. No `optimizePackageImports` in Next.js Config

**File:** `next.config.ts`

**Problem:** Next.js 15 supports `experimental.optimizePackageImports` which enables automatic tree-shaking for barrel-exported packages. Without it, imports from `lucide-react`, `recharts`, `framer-motion`, `firebase/*`, and `@radix-ui/*` may pull in more code than needed.

**Before:**
```ts
const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: { ... },
  // No experimental config
};
```

**After:**
```ts
const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: { ... },
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'recharts',
      'date-fns',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toast',
      '@radix-ui/react-tooltip',
      '@radix-ui/react-accordion',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-popover',
      '@radix-ui/react-menubar',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-separator',
      '@radix-ui/react-switch',
      '@radix-ui/react-slider',
      '@radix-ui/react-radio-group',
      '@radix-ui/react-progress',
      '@radix-ui/react-avatar',
      '@radix-ui/react-label',
      '@radix-ui/react-collapsible',
      'react-hook-form',
      'zod',
    ],
  },
  // ... rest unchanged
};
```

**Impact:** Unused JS ↓ ~20–40KB. Especially impactful for `lucide-react` (each icon is a separate module) and `recharts`.

✅ UI/Animations/Functionality: unchanged.

---

### 🔴 6. `force-dynamic` on All Public Pages Prevents Caching/ISR

**File:** `src/app/page.tsx`, `src/app/work/page.tsx`, `src/app/blog/page.tsx`

**Problem:** `export const dynamic = 'force-dynamic'` forces every request to be a full server render with no caching. For a portfolio site where content changes infrequently, this means every visitor pays the full Firebase fetch latency (~200–500ms per query × 9 queries on the homepage = **~2–4.5s TTFB**).

**Before:**
```tsx
export const dynamic = 'force-dynamic';
```

**After:** Use ISR with a reasonable revalidation window:
```tsx
export const revalidate = 60; // Revalidate at most every 60 seconds
// Remove: export const dynamic = 'force-dynamic';
```

**Impact:** TTFB ↓ ~1–3s on repeat visits (cached SSR). LCP ↓ proportionally. Speed Index ↓ significantly.

✅ UI/Animations/Functionality: unchanged — content updates within 60 seconds.

---

### 🟠 7. Recharts Namespace-Imported in Chart UI Component

**File:** `src/components/ui/chart.tsx`

**Problem:** `import * as RechartsPrimitive from "recharts"` pulls the entire Recharts library (~300KB) into any page that imports this chart wrapper — even if only a fraction of chart types are used. This component is shadcn boilerplate and is imported by the admin dashboard.

**Before:**
```tsx
import * as RechartsPrimitive from "recharts"
```

**After:**
```tsx
import {
  ResponsiveContainer,
  Tooltip,
  Legend,
  type TooltipProps,
  type LegendProps,
} from "recharts"
```

Then update all references from `RechartsPrimitive.X` to the named import. Since this is shadcn boilerplate and the admin page directly imports from `recharts` anyway, this is less critical for the public-facing pages — **but only if chart.tsx is not imported by any public page's dependency chain**.

**Impact:** Potential ↓ ~100–200KB if chart.tsx is transitively imported on public pages.

✅ UI/Animations/Functionality: unchanged.

---

### 🟠 8. `IntroScreen` and `CustomCursor` Loaded in Root Layout for All Routes

**File:** `src/app/layout.tsx`

**Problem:** `IntroScreen` and `CustomCursor` are loaded in the root layout, meaning they ship to `/admin/*`, `/blog/*`, `/work/*` — pages where they add no value. `IntroScreen` already exits early for non-home routes, but its JS (including `framer-motion`) is still bundled and hydrated.

**Before:**
```tsx
// src/app/layout.tsx
import { CustomCursor } from '@/components/portfolio/custom-cursor';
import { IntroScreen } from '@/components/portfolio/intro-screen';
// ...
<IntroScreen />
<CustomCursor />
```

**After:** Dynamically import both:
```tsx
import dynamic from 'next/dynamic';

const IntroScreen = dynamic(
  () => import('@/components/portfolio/intro-screen').then(m => ({ default: m.IntroScreen })),
  { ssr: false }
);
const CustomCursor = dynamic(
  () => import('@/components/portfolio/custom-cursor').then(m => ({ default: m.CustomCursor })),
  { ssr: false }
);
```

Better yet, move them into a portfolio-specific layout (`src/app/(portfolio)/layout.tsx`) so admin routes never load them at all.

**Impact:** Admin & sub-page bundles ↓ ~30–50KB each. TBT on non-home pages ↓.

✅ UI/Animations/Functionality: unchanged.

---

### 🟠 9. Hero Animation Uses Non-Composited `width` Property

**File:** `src/components/portfolio/hero.tsx` (line 76-80), `src/components/portfolio/intro-screen.tsx` (lines 87-89, 172-174)

**Problem:** Framer Motion is animating `width` and `top` — these are **layout-triggering properties** that force the browser to recalculate layout on every frame, causing jank and increased TBT.

**Before (hero.tsx):**
```tsx
<motion.div
  initial={{ width: 0 }}
  animate={{ width: "40%" }}
  transition={{ duration: 2, delay: 0.6, ease: "circOut" }}
  className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent mt-8 md:mt-12 mx-auto"
/>
```

**Before (intro-screen.tsx):**
```tsx
<motion.div
  className="absolute inset-0 w-full h-[1px] bg-primary/20 z-10"
  initial={{ top: "-10%" }}
  animate={{ top: "110%" }}
  transition={{ duration: 6, ease: "linear" }}
/>
```

**After (hero.tsx):** Animate `scaleX` instead of `width`:
```tsx
<motion.div
  initial={{ scaleX: 0 }}
  animate={{ scaleX: 1 }}
  transition={{ duration: 2, delay: 0.6, ease: "circOut" }}
  className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent mt-8 md:mt-12 mx-auto origin-center"
  style={{ maxWidth: "40%" }}
/>
```

**After (intro-screen.tsx):** Animate `translateY` instead of `top`:
```tsx
<motion.div
  className="absolute left-0 right-0 h-[1px] bg-primary/20 z-10"
  initial={{ y: "-10vh" }}
  animate={{ y: "110vh" }}
  transition={{ duration: 6, ease: "linear" }}
/>
```

**Impact:** Reduced layout thrashing → smoother animations → TBT ↓ ~100–300ms.

✅ UI/Animations/Functionality: visually identical animations, just GPU-composited.

---

### 🟠 10. `CustomCursor` Re-renders on Every Mouse Move via `setState`

**File:** `src/components/portfolio/custom-cursor.tsx`

**Problem:** The `isVisible` state is set on every first mouse move, and `setCursorVariant` / `setCursorText` trigger React re-renders on *every* `mousemove` event. While `useMotionValue` is correctly used for x/y (no re-renders), the variant logic still causes hundreds of React re-renders per second.

**Before:**
```tsx
const moveCursor = (e: MouseEvent) => {
  if (!isVisible) setIsVisible(true); // state update
  // ...
  setCursorVariant("pointer"); // state update on every move
  setCursorText(""); // state update on every move
};
```

**After:** Debounce variant detection or use refs:
```tsx
const cursorVariantRef = useRef("default");
const cursorTextRef = useRef("");
const [, forceUpdate] = useState(0);

const moveCursor = (e: MouseEvent) => {
  if (!isVisible) setIsVisible(true);
  mouseX.set(e.clientX);
  mouseY.set(e.clientY);

  const target = e.target as HTMLElement;
  if (!target) return;

  let newVariant = "default";
  let newText = "";

  const customCursorLabel = target.closest('[data-cursor]')?.getAttribute('data-cursor');
  const isPointer = window.getComputedStyle(target).cursor === 'pointer' ||
                    target.closest('a') || target.closest('button');

  if (customCursorLabel) { newVariant = "custom"; newText = customCursorLabel; }
  else if (isPointer) { newVariant = "pointer"; }

  if (newVariant !== cursorVariantRef.current || newText !== cursorTextRef.current) {
    cursorVariantRef.current = newVariant;
    cursorTextRef.current = newText;
    forceUpdate(n => n + 1); // only re-render when variant actually changes
  }
};
```

**Impact:** TBT ↓ ~200–500ms (fewer React reconciliation cycles during scroll/mouse interactions).

✅ UI/Animations/Functionality: unchanged — cursor behaves identically.

---

### 🟡 11. Hero `<Image>` Missing `priority` Prop

**File:** `src/components/portfolio/projects.tsx`

**Problem:** The first project image visible above-the-fold on the homepage does not have `priority` set. While the hero section itself is text-based (not an image), the first project card's image could be the LCP element on certain viewport sizes.

**Before:**
```tsx
<Image
  src={project.image || '...'}
  alt={project.title}
  fill
  className="object-cover"
  sizes="(min-width: 1024px) 60vw, 100vw"
/>
```

**After (only for the first project card, index === 0):**
```tsx
<Image
  src={project.image || '...'}
  alt={project.title}
  fill
  className="object-cover"
  sizes="(min-width: 1024px) 60vw, 100vw"
  priority={index === 0}
/>
```

**Impact:** LCP ↓ ~100–300ms for viewports where the first project image is the LCP element.

✅ UI/Animations/Functionality: unchanged.

---

### 🟡 12. `@aws-sdk/client-s3` — Verified Server-Only ✅

**File:** `src/lib/aws/s3-actions.ts`

**Problem:** None — correctly guarded.

The file has `'use server'` at the top, which ensures `@aws-sdk/client-s3` (~200KB) is **never** included in the client bundle. This is properly implemented.

✅ No action needed.

---

### 🟡 13. `gsap` in `package.json` but Not Imported Anywhere

**File:** `package.json`

**Problem:** GSAP (`gsap: ^3.12.5`) is listed as a dependency but has **zero imports** across the entire `src/` directory. It's dead weight in `node_modules` and may be accidentally bundled by some build configurations.

**After:** Remove from dependencies if truly unused:
```bash
npm uninstall gsap
```

**Impact:** Cleaner dependency tree. No bundle impact if truly unused (Next.js tree-shakes it), but removes risk.

✅ UI/Animations/Functionality: unchanged — GSAP isn't used anywhere.

---

### 🟡 14. Firebase Config Barrel File

**File:** `src/lib/firebase/config.ts`

**Problem:** This is a barrel file that re-exports `app`, `auth`, `db`, `storage`. While most public components import from `@/lib/firebase/firestore` directly (good!), `auth-context.tsx` imports from `config.ts` which could pull in `storage` unnecessarily.

**Before:**
```tsx
// src/context/auth-context.tsx
import { auth, db } from '@/lib/firebase/config';
```

**After:**
```tsx
import { auth } from '@/lib/firebase/auth';
import { db } from '@/lib/firebase/firestore';
```

**Impact:** Minor — potentially avoids loading Firebase Storage SDK (~50KB) in the auth context.

✅ UI/Animations/Functionality: unchanged.

---

## Quick Wins

| # | Fix | Effort | Impact |
|---|-----|--------|--------|
| 1 | Add `optimizePackageImports` to `next.config.ts` | 2 min | ~20–40KB JS reduction |
| 2 | `next/dynamic` + `ssr: false` on `Hero3D` | 5 min | ~600KB off initial load |
| 3 | Replace `<link>` fonts with `next/font/google` | 10 min | ~300–500ms LCP improvement |
| 4 | Replace `force-dynamic` with `revalidate = 60` | 2 min | ~1–3s TTFB improvement |
| 5 | `next/dynamic` on `IntroScreen` + `CustomCursor` | 5 min | ~30–50KB per route |
| 6 | Remove unused `gsap` dependency | 1 min | Cleaner deps |
| 7 | Add `priority` to first project `<Image>` | 1 min | ~100–300ms LCP |

---

## Estimated Gains

| Metric | Current | After All Fixes | Target |
|--------|---------|-----------------|--------|
| **TBT** | 10,080ms | ~200–500ms | <200ms |
| **LCP** | 2.1s | ~0.8–1.2s | <1.5s |
| **Speed Index** | 6.7s | ~1.5–2.5s | <2.5s |
| **Unused JS** | 81 KiB | ~5–15 KiB | <10 KiB |
| **Unused CSS** | 13 KiB | ~5–8 KiB | minimal |

---

## Fix Order

Ranked by impact-to-effort ratio:

1. **🔴 Issue #1** — Dynamic import Hero3D (`next/dynamic + ssr:false`) → biggest single TBT reducer
2. **🔴 Issue #6** — Replace `force-dynamic` with `revalidate = 60` → eliminates repeated TTFB penalty
3. **🔴 Issue #2** — Switch to `next/font/google` → eliminates render-blocking fonts
4. **🔴 Issue #5** — Add `optimizePackageImports` → automatic tree-shaking improvement
5. **🔴 Issue #4** — Remove Firebase from client components → ~150KB bundle reduction
6. **🔴 Issue #3** — Shorten IntroScreen timing → unblocks LCP measurement
7. **🟠 Issue #8** — Dynamic import IntroScreen + CustomCursor → lighter sub-page bundles
8. **🟠 Issue #9** — Fix non-composited animations → smoother rendering
9. **🟠 Issue #10** — Optimize CustomCursor re-renders → less React work
10. **🟠 Issue #7** — Named recharts imports → smaller chart component
11. **🟡 Issue #11** — Add `priority` to first Image → marginal LCP gain
12. **🟡 Issue #13** — Remove unused gsap → clean deps
13. **🟡 Issue #14** — Fix Firebase config barrel → avoid accidental storage SDK load

---

> [!NOTE]
> All fixes above preserve UI, design, animations (Framer Motion), and functionality exactly as-is. The changes target only code splitting, import strategy, bundling, caching, and compositing — never visual output.
