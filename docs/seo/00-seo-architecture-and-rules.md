# SEO Architecture and Rules: Kartik Jindal Portfolio

## 1. SEO Goals and Constraints
- **Primary Goal**: Achieve maximum search engine visibility for "Kartik Jindal" and specific engineering/architectural keywords without altering the cinematic UI.
- **Strict Constraint**: Do not modify visible typography, spacing, or layout.
- **Strict Constraint**: SEO management must be centralized in the Admin Panel.
- **Technical Stack**: Next.js Metadata API, Cloud Firestore, JSON-LD Structured Data.

## 2. SEO Hierarchy
The system follows a "Cascade with Override" model:
1. **Global Default**: Defined in `site_config/global`.
2. **Page-Level Override**: Specific metadata for static routes (Home, Work Archive, Journal Archive).
3. **Item-Level Override**: Individual metadata for Projects and Blog Posts.

## 3. Content Management Scope

### SEO-Managed Entities
- **Global**: Default Title, Meta Description, OG Image, Twitter Handle.
- **Pages**: `/`, `/work`, `/blog`.
- **Items**: All documents in `projects` and `blog` collections.
- **Sections**: About, Skills, Experience, and Testimonials (contribute to structured data but don't have separate URL-level SEO).

### Excluded Entities
- **Resume**: Explicitly excluded from SEO management.

## 4. SEO Control Fields
Each SEO-managed entry will include the following schema:
- `seoTitle`: string (Auto-suggested from `title`)
- `seoDescription`: string (Auto-suggested from `summary` or `desc`)
- `seoKeywords`: string[] (Auto-suggested from `tech` or `category`)
- `ogImage`: string (URL - Fallback to global default)
- `canonicalUrl`: string (Auto-generated based on `slug`)
- `indexable`: boolean (Toggle for `noindex, nofollow`)

## 5. Auto-Suggestion Rules
When manual SEO fields are empty, the system will apply these fallbacks:
- **Title**: `{{itemTitle}} | Kartik Jindal`
- **Description**: Truncate the first 160 characters of the `summary` (Blog) or `shortDesc` (Project).
- **Keywords**: Join the `tech` array (Projects) or `category` (Blog) into a comma-separated string.
- **OG Image**: Use the primary `image` of the project/post.

## 6. SEO Scoring Logic (Admin UI)
A side panel in the editor will display a score (0-100) based on:
- **Title Length**: Green (50-60 chars), Yellow (30-49, 61-70), Red (<30, >70).
- **Description Length**: Green (120-160 chars), Yellow (70-119), Red (<70, >160).
- **Keywords**: Check if at least 3 keywords are present.
- **Image Check**: Verify if an OG image is defined.
- **Slug Check**: Verify URL-friendliness and length.

## 7. Breadcrumb Strategy
- **Scope**: Breadcrumbs will *only* appear on Project Detail and Blog Detail pages.
- **Styling**: Minimalist, text-only breadcrumbs matching the `text-white/40` and `text-primary` palette.
- **Structure**: `Home > Work > [Project Name]` or `Home > Journal > [Post Title]`.

## 8. Technical Strategy
- **Sitemap**: Dynamic generation in `src/app/sitemap.ts` based on Firestore documents.
- **Robots**: Managed in `src/app/robots.ts`.
- **Structured Data**:
    - **Person**: Global (Home).
    - **Article**: For Blog Posts.
    - **CreativeWork/SoftwareApplication**: For Projects.
- **Canonical URLs**: Every page will include a `<link rel="canonical">` to prevent duplicate content issues (especially important for slug fallbacks).

## 9. Admin UX Plan
- **SEO Side Panel**: A persistent "SEO HUD" in the Project/Blog editor.
- **Live Preview**: Real-time simulation of a Google Search result snippet.
- **One-Click Sync**: A button to "Auto-Populate" empty fields based on content analysis.

## 10. Implementation Plan: Next Stage
1. Update Firestore schemas to include SEO maps in `projects` and `blog`.
2. Implement the SEO Side Panel component in the Admin layout.
3. Integrate real-time scoring logic into the editor views.
4. Update public Detail pages to render Breadcrumbs and Item-level metadata.
5. Enhance `generateMetadata` functions across all public routes.

## Uncertainties / To Be Confirmed
- *Uncertainty*: Should we allow separate OG images for Twitter vs. Facebook? (Strategy: Stick to standard OG for simplicity unless requested).
- *Uncertainty*: Should the "Interface" settings page also have SEO overrides? (Strategy: Included in the Page-Level override plan).
