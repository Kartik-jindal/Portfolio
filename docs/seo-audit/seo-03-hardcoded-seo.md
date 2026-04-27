# SEO Hardcoded Behaviors Audit: Kartik Jindal Portfolio

## 1. Executive Summary
While the application provides extensive CMS controls for item-level metadata, the underlying SEO framework relies heavily on hardcoded logic for fallback states, structured data templates, and technical directives. Critical SEO elements such as the robots.txt rules, sitemap priorities, and JSON-LD identification (Author/Person) are currently "locked" in code. This provides stability but prevents the site owner from adjusting strategic parameters (like crawling frequency or job titles) without manual code intervention.

---

## 2. Complete List of Hardcoded SEO Behaviors

| Exact File Path | What is hardcoded? | Why it matters | Scope | Safety |
|:---|:---|:---|:---|:---|
| `src/app/layout.tsx` | Base Metadata title & description. | Acts as the ultimate fallback for all routes. | Global | Safe |
| `src/app/robots.ts` | Disallow rules for `/admin/` and `/admin/*`. | Prevents indexing of private management routes. | Global | Safe |
| `src/app/sitemap.ts` | Change frequency (`weekly`/`monthly`) and Priority (`1.0`, `0.8`, `0.7`). | Informs search engines of crawling importance. | Global | Should be editable |
| `src/app/page.tsx` | JSON-LD `Person` Job Title ("Full Stack Architect"). | Hardcodes the primary professional identity in structured data. | Route (/) | Should be editable |
| `src/app/page.tsx` | Fallback OG Image (`picsum.photos/seed/portfolio/1200/630`). | Controls social previews when no image is defined in CMS. | Route (/) | Should be editable |
| `src/app/blog/[slug]/page.tsx` | Metadata suffix (` | Kartik Jindal`). | Enforces brand consistency across all post titles. | Route-Level | Safe |
| `src/app/blog/[slug]/post-client.tsx`| JSON-LD `Author` name ("Kartik Jindal"). | Hardcodes the author identity for every blog post. | Item-Level | Should be editable |
| `src/app/blog/page.tsx` | Rendering Strategy (`'use client'`). | Effectively blocks server-side metadata generation for the Journal index. | Route-Level | **Risk** |
| `src/app/work/page.tsx` | Archive titles and descriptions. | Default SEO copy for the Work archive. | Route-Level | Customizable (CMS) |

---

## 3. Derived But Not Editable
These values are generated automatically by logic and cannot be tuned directly from the Admin Panel.

- **Slug Generation Logic**: In `src/app/(admin)/admin/blog/new/page.tsx`, the regex `/[^\w\s-]/g` and space-to-dash conversion logic is hardcoded. While the *result* is editable, the *transformation rule* is not.
- **Abstract Excerpting**: In `generateMetadata` (`blog/[slug]/page.tsx`), the logic `post.summary?.substring(0, 160)` is hardcoded. The length of the auto-generated meta description is strictly limited to 160 characters in code.
- **Legacy Category Fallbacks**: In `post-client.tsx`, the logic `post.categories || [post.category] || ['Engineering']` hardcodes "Engineering" as the default category if the database record is empty.
- **Canonical URL Construction**: The logic for appending the base URL to the slug is hardcoded in the metadata generation functions, relying on the availability of `process.env.NEXT_PUBLIC_BASE_URL`.

---

## 4. Fallback and Inheritance Behavior
The system follows a strict hierarchy for metadata resolution:

1.  **Level 1 (Specific)**: Manual SEO map fields in Firestore (e.g., `seo.title`).
2.  **Level 2 (Derived)**: If Level 1 is empty, the system derives values from content fields (e.g., `title + " | Kartik Jindal"`).
3.  **Level 3 (Route Defaults)**: If Level 2 fails, it pulls from `site_config/seo_pages`.
4.  **Level 4 (Global Root)**: The ultimate fallback defined in `src/app/layout.tsx`.

---

## 5. SEO Risks Caused by Hardcoding

### A. Rendering Strategy Blocking Indexing
`src/app/blog/page.tsx` is currently a Client Component. Because Next.js `generateMetadata` and `generateViewport` are only supported in Server Components, the Journal archive route cannot export dynamic metadata. This forces search engines to rely on the generic root layout metadata for the entire blog index, potentially hurting rankings for "Engineering Blog" or related keywords.

### B. Inflexible Sitemap Priorities
The sitemap hardcodes a priority of `0.7` for all blog posts. This treats a "Hello World" post with the same importance as a "High-Value Deep Dive Case Study." There is no mechanism in the CMS to mark specific posts as high-priority (`1.0`) for search engines.

### C. Hardcoded Identity in Structured Data
The Job Title ("Full Stack Architect") and Author Name ("Kartik Jindal") are hardcoded directly into the JSON-LD generation scripts. If the user pivots their brand identity (e.g., to "Digital Product Designer"), updating the CMS will not update the structured data seen by Google's Rich Results, creating a metadata mismatch.

### D. Static Robots Directives
The `robots.txt` cannot be updated without a code deployment. This prevents the user from quickly blocking specific sub-paths (e.g., a new experimental route) or adding new bot exclusion rules if the site experiences crawl-budget issues.