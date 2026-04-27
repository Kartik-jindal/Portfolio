
# Rollback Notes: SEO Phase 1

If any issues occur after the SEO implementation, follow these steps to revert:

## 1. UI/Layout Glitches
If the Navbar or Hero section behaves unexpectedly, revert `src/app/layout.tsx` and `src/components/portfolio/navbar.tsx`. These files were updated to handle server-side headers and dynamic config.

## 2. Intro Screen Issues
If the entrance animation stops working for humans, revert `src/components/portfolio/intro-screen.tsx`. The bot-detection regex might be too aggressive in certain legacy browsers.

## 3. Admin Panel Errors
If the Settings or Editor pages fail to save, revert the changes in `src/app/(admin)/admin/settings/page.tsx` and the editor pages. These added new Firestore fields (`altText`, `identity`).

## 4. Reversion Priority
1. `src/components/portfolio/intro-screen.tsx` (Highest probability of false-positives)
2. `src/app/layout.tsx`
3. CMS Editors

All changes were strictly additive or logic-based; no existing database schemas were deleted.
