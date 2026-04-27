# Admin Validation & Quality Intelligence Plan

## 1. Objectives
Introduce real-time feedback loops into the Admin Panel to ensure all content meets high-fidelity SEO, accessibility, and architectural standards.

## 2. Validation Heuristics

### A. Metadata Quality (Real-time)
- **Title Length**: Warning if < 30 or > 70 characters (Optimal: 50-60).
- **Description Length**: Warning if < 70 or > 160 characters (Optimal: 120-160).
- **Slug Integrity**: Real-time validation for URL-friendly characters and length.

### B. Accessibility & Media (Critical)
- **Alt Text Check**: Visual warning if an image is uploaded but the `altText` field remains empty.
- **Image Resolution**: (Future) Check for recommended aspect ratios.

### C. GEO & AEO Completeness
- **Entity Identity**: Warning if core identity markers (Expertise/Bio) are missing in Global Settings.
- **Answer Coverage**: Hint in content editors if the "Quick Answer" or "FAQs" are empty.

## 3. UI Implementation
- **Visual Cues**: Use color-coded text (yellow/red) and icons (AlertTriangle) next to labels.
- **Save Integrity**: Implement "Soft Blocking"—if critical fields are missing, show a summary toast of warnings before committing the save, but allow the user to proceed if they choose.

## 4. Files Affected
- `src/app/(admin)/admin/projects/[id]/page.tsx` (Project editor heuristics)
- `src/app/(admin)/admin/projects/new/page.tsx` (New project heuristics)
- `src/app/(admin)/admin/blog/[id]/page.tsx` (Blog editor heuristics)
- `src/app/(admin)/admin/blog/new/page.tsx` (New blog heuristics)
- `src/app/(admin)/admin/settings/page.tsx` (Identity completeness)
- `src/app/(admin)/admin/seo/page.tsx` (Page-level SEO validation)

## 5. Safety & UI Preservation
- **Non-Blocking**: All validations are advisory. The admin remains in full control.
- **Performance**: Validations run locally in the client component with zero database overhead.
- **Design**: Validation messages will match the high-fidelity cinematic aesthetic of the existing command center.
