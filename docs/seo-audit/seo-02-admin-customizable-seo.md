# SEO Admin & Customization Audit: Kartik Jindal Portfolio

## 1. Executive Summary
The portfolio features a comprehensive administrative control plane for SEO, allowing for granular overrides of standard metadata. Content is stored in Firestore and utilized by Next.js Server Components to generate search-engine-friendly tags via the `generateMetadata` API. While post-level and archive-level controls are robust, a significant gap exists for the primary Blog Archive route (which is client-rendered) and individual Project SEO maps (as projects lack dedicated sub-routes).

---

## 2. Complete Customizable SEO Controls

| Field Name | Admin Location | Storage Path (Firestore) | Affected Public Route(s) | Wiring Status |
|:---|:---|:---|:---|:---|
| **Global Default Title** | SEO Command | `site_config/global` -> `seo.defaultTitle` | All (as ultimate fallback) | Fully Wired |
| **Global Meta Description** | SEO Command | `site_config/global` -> `seo.defaultDescription` | All (as ultimate fallback) | Fully Wired |
| **Global Keywords** | SEO Command | `site_config/global` -> `seo.keywords` | `/` | Fully Wired |
| **Global OG Image** | SEO Command / Settings | `site_config/global` -> `seo.ogImage` | All (as fallback) | Fully Wired |
| **Home Meta Map** | SEO Command | `site_config/seo_pages` -> `home` | `/` | Fully Wired |
| **Work Archive Meta Map** | SEO Command | `site_config/seo_pages` -> `work` | `/work` | Fully Wired |
| **Blog Archive Meta Map** | SEO Command | `site_config/seo_pages` -> `blog` | `/blog` | **Unused** (Client Component) |
| **Post SEO Title** | Blog Editor | `blog/{id}` -> `seo.title` | `/blog/[slug]` | Fully Wired |
| **Post Meta Description** | Blog Editor | `blog/{id}` -> `seo.description` | `/blog/[slug]` | Fully Wired |
| **Post Keywords** | Blog Editor | `blog/{id}` -> `seo.keywords` | `/blog/[slug]` | Fully Wired |
| **Post Indexable Toggle** | Blog Editor | `blog/{id}` -> `seo.indexable` | `/blog/[slug]` | Fully Wired |
| **Post Canonical URL** | Blog Editor | `blog/{id}` -> `seo.canonicalUrl` | `/blog/[slug]` | Fully Wired |
| **Post OG Image** | Blog Editor | `blog/{id}` -> `seo.ogImage` | `/blog/[slug]` | Fully Wired |
| **Post Slug** | Blog Editor | `blog/{id}` -> `slug` | `/blog/[slug]` / Sitemap | Fully Wired |
| **Project SEO Map** | Project Editor | `projects/{id}` -> `seo.*` | N/A (Modal based) | **Unused** |
| **Project Slug** | Project Editor | `projects/{id}` -> `slug` | Sitemap (Redirect target) | Partially Wired |
| **Social Connectors** | System Settings | `site_config/global` -> `socials.*` | `/` (JSON-LD Person) | Fully Wired |

---

## 3. Control Details & Data Flow

### A. Global & Page-Level Controls (`site_config`)
- **Source Files**: `src/app/(admin)/admin/seo/page.tsx`
- **Data Flow**: Admin form updates `site_config/global` or `site_config/seo_pages`. 
- **Wiring**:
  - `src/app/page.tsx` fetches `seo_pages.home` and `global` in a server component to populate `generateMetadata`.
  - `src/app/work/page.tsx` fetches `seo_pages.work` to populate `generateMetadata`.
- **Gaps**: `src/app/blog/page.tsx` is marked with `'use client'`. Because metadata must be exported from a Server Component, the Blog Archive override in the CMS is currently non-functional.

### B. Blog Post Item Controls (`blog` collection)
- **Source Files**: `src/app/(admin)/admin/blog/[id]/page.tsx`
- **Data Flow**: Individual post documents contain an `seo` map.
- **Wiring**: 
  - `src/app/blog/[slug]/page.tsx` performs a server-side lookup by slug.
  - `generateMetadata` prioritizes fields in the `seo` map (Title, Description, Canonical, OG Image) before falling back to document defaults.
  - `src/app/sitemap.ts` iterates through all `status == 'published'` blog posts to generate dynamic XML entries.

### C. Project Item Controls (`projects` collection)
- **Source Files**: `src/app/(admin)/admin/projects/[id]/page.tsx`
- **Critical Audit Note**: While the Admin UI provides a full SEO suite for projects (Title, Description, etc.), the public site renders projects inside a `Dialog` (Modal) component on the `/work` page. 
- **Impact**: Projects do not have individual indexable URLs (e.g., `/work/my-project`). Consequently, search engines cannot index the project-specific metadata fields managed in the CMS. These fields are effectively "zombie fields" until projects are migrated to a sub-route pattern.

### D. Structured Data Controls
- **Source Files**: `src/app/page.tsx` (Person), `src/app/blog/[slug]/post-client.tsx` (BlogPosting)
- **Data Flow**: CMS fields like `socials`, `title`, `summary`, and `image` are injected into inline `<script type="application/ld+json">` tags.

---

## 4. Customizable but SEO-Irrelevant
The following admin-editable settings exist for UI/UX purposes but have no bearing on search engine crawling or metadata:
- **Project Accent Color**: (Project Editor) Controls visual blur effects.
- **Display Order**: (Project/Experience Editor) Controls UI sorting order.
- **Read Time / Display Date**: (Blog Editor) Informational text for users.
- **Section Visibility Toggles**: (System Settings) Controls whether sections like Testimonials appear, but doesn't change head metadata.
- **Interface Nav Items**: (Layout Config) Controls Navbar link order but doesn't change `robots.txt` or main metadata.

---

## 5. Missing but Expected Controls (Inferred Gaps)
- **Image Alt Text Fields**: There are no dedicated "Alt Text" fields for blog or project images. The system relies on titles or `imageHint`, which may not be optimal for accessible or image-search SEO.
- **Global Robots Toggle**: No admin switch to toggle the entire site between `index` and `noindex` (useful for staging).
- **Structured Data for Projects**: While Blog posts have `BlogPosting` schema, Projects lack `SoftwareApplication` or `CreativeWork` structured data.
- **Sitemap Priority/Frequency Tuning**: These are hardcoded in `sitemap.ts` and cannot be tuned per post/page via the CMS.
- **Custom Header/Script Injection**: No "Header Code" section in settings to allow for easy management of Google Analytics (GTM) or tracking pixels without code changes.