# Admin Productivity & Intelligence Plan

## 1. Objectives
Accelerate the editorial workflow by providing real-time simulations of external platforms (Social, AI) and enabling faster state management directly from the archive views.

## 2. Intelligence Enhancements

### A. The Social Simulation Engine
- **Problem**: Metadata is often verified post-deployment using external tools.
- **Solution**: Add a "Social Preview" tab to the `SeoHud`.
- **Implementation**: Simulate a Twitter/LinkedIn card preview within the editor to verify OG Image and Title cropping.

### B. Entity Schema HUD
- **Problem**: GEO/AEO structured data (JSON-LD) is invisible to the admin, making it hard to verify if "Hard Facts" are correctly mapped.
- **Solution**: Add a collapsible "Schema Preview" section to editors.
- **Impact**: Shows the exact JSON-LD blob that AI engines will crawl.

### C. Tactical Inline Controls
- **Problem**: Changing a status from Draft to Published requires opening the full editor.
- **Solution**: Add one-click status toggles to the Project and Journal list views.

## 3. Files Affected
- `src/components/admin/seo-hud.tsx` (Social Simulation)
- `src/app/(admin)/admin/projects/page.tsx` (Inline toggles)
- `src/app/(admin)/admin/blog/page.tsx` (Inline toggles)
- `src/app/(admin)/admin/projects/[id]/page.tsx` (Schema HUD)
- `src/app/(admin)/admin/blog/[id]/page.tsx` (Schema HUD)

## 4. Safety & UI Preservation
- **Admin Only**: All changes are strictly contained within the administrative "Command Center."
- **Data Integrity**: Uses existing Firestore update logic for inline toggles.
- **Performance**: Simulations are pure CSS/React and run entirely on the client.