# SEO Admin Controls and Schema Specification

## 1. Data Schema
The SEO system utilizes a standardized map structure stored within existing Firestore documents.

### SEO Map Structure
```typescript
seo: {
  title: string;       // Manual override
  description: string; // Manual override
  keywords: string;    // Comma-separated string
  ogImage: string;     // URL to S3 asset
  indexable: boolean;  // Toggle for search indexing
  canonicalUrl?: string; // Optional override
}
```

## 2. Storage Strategy
- **Global Defaults**: Stored in `site_config/global`.
- **Page Overrides**: Stored in `site_config/seo_pages`. (Fields: `home`, `work`, `blog`)
- **Projects**: Stored inside each document in the `projects` collection.
- **Blog Posts**: Stored inside each document in the `blog` collection.

## 3. Auto-Suggestion Logic (Fallbacks)
If fields are left empty in the editor, the public renderer applies these rules:

- **SEO Title**:
  - Item: `{{title}} | Kartik Jindal`
  - Page: `{{PageName}} | Kartik Jindal`
- **SEO Description**:
  - Project: First 160 chars of `desc`.
  - Blog: First 160 chars of `summary`.
- **Keywords**:
  - Project: Join `tech` array.
  - Blog: Post `category`.
- **OG Image**:
  - Item: Use primary `image` field.
  - Page: Use global `ogImage` from settings.

## 4. Admin UX: The SEO HUD
The SEO Score Side Panel (HUD) calculates a 0-100 score based on:
- **Title (30pts)**: 50-60 chars (Optimal), 30-49/61-70 (Acceptable).
- **Description (30pts)**: 120-160 chars (Optimal).
- **Keywords (20pts)**: Presence of at least 3 terms.
- **Visuals (20pts)**: Presence of OG Image URL.

## 5. Next Stage Instructions
1.  **Public Wiring**: Update `generateMetadata` in `app/page.tsx`, `app/work/page.tsx`, and `app/blog/[slug]/page.tsx` to utilize this data.
2.  **Breadcrumbs**: Implement the minimalist text-only breadcrumb component on detail pages.
3.  **Structured Data**: Wire the JSON-LD generators to use the item-specific SEO fields.
