# Metadata Control Enhancement Plan

## 1. Objectives
Improve the precision and automation of metadata management within the Admin Panel to ensure optimal search engine presentation (SERP).

## 2. Enhancements

### A. Real-time Precision Tools
- **Character Counters**: Add visual length indicators for SEO Title (60 limit) and Meta Description (160 limit).
- **SERP Preview**: Integrate a visual simulation of a Google Search result into the SEO HUD.

### B. Automation & Syncing
- **Auto-Populate Logic**: Add a "Sync Content" button to the SEO section that extracts and truncates metadata from the main title/summary fields.
- **Slug Validation**: Provide visual feedback for URL-friendliness in the slug field.

### C. HUD Improvements
- **Visual Score Breakdown**: Update the `SeoHud` to provide more granular feedback on why a score is high or low.

## 3. Files Affected
- `src/components/admin/seo-hud.tsx` (Added SERP Preview)
- `src/app/(admin)/admin/projects/[id]/page.tsx` (Sync logic + Counters)
- `src/app/(admin)/admin/blog/[id]/page.tsx` (Sync logic + Counters)
- `src/app/(admin)/admin/projects/new/page.tsx` (Counters)
- `src/app/(admin)/admin/blog/new/page.tsx` (Counters)

## 4. Safety & UI Preservation
- **Additive Only**: Existing metadata will not be overwritten without a user clicking "Sync".
- **Zero Public Impact**: All changes are strictly internal to the `/(admin)` route group.
- **Visual Consistency**: New controls will match the existing high-fidelity "Command Center" aesthetic.