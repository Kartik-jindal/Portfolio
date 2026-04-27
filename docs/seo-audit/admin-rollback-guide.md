# Administrative Rollback & Recovery Guide

## 1. Scope of Reversion
All upgrades implemented in the "Admin Productivity & Intelligence" phase were strictly additive. No existing data schemas were deleted, and all public-facing files remained untouched.

## 2. Reversion Steps (Code)
To restore the admin panel to its original "singular CRUD" state:
1. **List Views**: Revert `src/app/(admin)/admin/projects/page.tsx` and `src/app/(admin)/admin/blog/page.tsx`. This will remove bulk actions and inline toggles.
2. **Editors**: Revert `projects/[id]/page.tsx` and `blog/[id]/page.tsx`. This will hide the AEO, GEO, and advanced metadata sections.
3. **Creation Forms**: Revert `new/page.tsx` files. This will remove cloning support.
4. **HUD Component**: Revert `src/components/admin/seo-hud.tsx`. This will restore the original basic scoring system.

## 3. Data Cleanup (Optional)
The new fields in Firestore (`aeo`, `entity`, `seo.indexable`, etc.) are additive. 
- **Recommendation**: Leave the data intact. If the UI fields are removed from code, Firestore will simply ignore these properties during the read/write cycle.
- **Manual Purge**: If total schema cleanliness is required, use the Firestore console to delete the following maps from documents: `aeo`, `entity`, and `identity`.

## 4. Safety Warning
Do NOT revert `src/lib/firebase/config.ts` or `src/lib/aws/s3-actions.ts` unless you are experiencing fundamental infrastructure connectivity issues unrelated to the recent UI upgrades.