# Robots.txt Technical Fix

## 1. Summary of Actions
Refactored the dynamic `robots.ts` generator to ensure valid 200 OK responses, correct environment-aware sitemap mapping, and robust exclusion of administrative routes.

## 2. Changes Implemented
- **URL Normalization**: Added regex-based trailing slash removal for `NEXT_PUBLIC_BASE_URL` to prevent malformed sitemap URLs (e.g., `https://domain.com//sitemap.xml`).
- **Path Shielding**: Verified that the entire `/(admin)` route group is explicitly disallowed.
- **Duplicate Content Mitigation**: Added a global disallow for all query string parameters (`/*?*`) to prevent crawlers from indexing filtered views as duplicate pages.
- **Environment Awareness**: Configured the output to prioritize the `NEXT_PUBLIC_BASE_URL` environment variable with a hard fallback to the primary production domain.

## 3. Technical Verification
- **Route**: `/robots.txt`
- **Response Code**: 200
- **Content-Type**: `text/plain`
- **Impact**: Ensures search engine bots correctly prioritize high-value content (Projects/Blog) and ignore management tools.

## 4. Rollback
Revert `src/app/robots.ts` to the previous version via Git. No database changes were made.
