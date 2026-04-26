
# Public SEO Wiring and Technical SEO

## 1. Overview
The SEO architecture is now fully integrated into the public-facing portfolio. Search engines can crawl optimized metadata for every page and item, while high-fidelity structured data informs rich snippets.

## 2. Dynamic Metadata Wiring
Implemented via the Next.js `generateMetadata` API in the following locations:
- **Homepage (`/`)**: Pulls from `site_config/seo_pages['home']` with fallback to `site_config/global`.
- **Work Archive (`/work`)**: Pulls from `site_config/seo_pages['work']`.
- **Journal Archive (`/blog`)**: Pulls from `site_config/seo_pages['blog']`.
- **Journal Post (`/blog/[slug]`)**: Pulls from the individual document's `seo` map.

### Metadata Cascade Logic
1. **Manual Field**: Always prioritized if present in Firestore.
2. **Auto-Suggestion**: 
   - **Titles**: `{{ItemName}} | Kartik Jindal`
   - **Descriptions**: Truncated summaries or short descriptions.
3. **Global Default**: Last fallback for images and site descriptors.

## 3. Structured Data (JSON-LD)
Rich snippets are generated on the server to ensure valid parsing by Google/Bing:
- **Person (Home)**: Standard identification with social links.
- **Article (Blog)**: Includes publication dates, author, and featured images.
- **CreativeWork (Projects)**: Currently integrated into project details for rich indexing.

## 4. Navigation & Breadcrumbs
Breadcrumbs have been added to Detail pages using a minimalist, design-compliant approach:
- **Scope**: Only on Project and Blog detail pages.
- **Structure**: `Home > [Section] > [Title]`.
- **Styling**: `text-white/40` and `text-primary` fonts to ensure no layout disruption.

## 5. Technical Strategy
- **Sitemap**: Auto-generated at `/sitemap.xml`, updated weekly via crawler. Includes all published blog slugs.
- **Robots.txt**: Configured at `/robots.txt` to allow public indexing while explicitly protecting the `/admin` command center.
- **Canonical URLs**: Every page explicitly defines a canonical link based on `process.env.NEXT_PUBLIC_BASE_URL` to prevent duplicate content issues.

## 6. Verification Checklist
- [x] Titles update dynamically per slug.
- [x] Open Graph images resolve to S3 assets.
- [x] Sitemap includes dynamic blog routes.
- [x] /admin routes are disallowed in robots.txt.
- [x] Breadcrumbs appear correctly on detail views.

## 7. Deployment Notes
- Ensure `NEXT_PUBLIC_BASE_URL` is set in Vercel settings (e.g., `https://kartikjindal.com`).
- The site uses Vercel's caching layer; metadata updates may take a few minutes to propagate unless the page is revalidated.
