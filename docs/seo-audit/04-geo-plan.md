# GEO and Entity Control Implementation Plan

## 1. Objectives
Maximize visibility in Generative Engine results (AI Overviews, Citations, Answer Engines) by providing structured, factual, and verifiable entity data through the Admin Panel.

## 2. Global Entity Hardening (GEO Identity)
- **Problem**: AI engines rely on "Entity Truth." Currently, some professional context (expertise, credentials) is trapped in unstructured narrative text.
- **Solution**: Add dedicated global fields to the Settings page.
- **Fields to Add**:
    - **Global**: Full Name, Bio (Concise Entity Summary), Expertise List (Array), Services Offered (Array), Credentials/Certifications (Array), sameAs Verification (Array for Wikipedia/verified profiles).

## 3. Per-Content Fact Extraction (AEO/GEO Intelligence)
- **Problem**: Projects and Posts lack structured "Outcome" and "Citation" markers that AI engines prefer for providing "Source Citations."
- **Solution**: Add "Generative Intelligence" sections to individual editors.
- **Fields to Add**:
    - **Projects**: Project Outcomes (Bullet points), Key Technical Facts, Citations/Mentions.
    - **Blog**: Primary Claims/Theses, Data Citations, Fact List.

## 4. Files Affected
- `src/app/(admin)/admin/settings/page.tsx` (Global Entity Tab expansion)
- `src/app/(admin)/admin/projects/[id]/page.tsx` (Generative Intel Section)
- `src/app/(admin)/admin/projects/new/page.tsx` (Generative Intel Section)
- `src/app/(admin)/admin/blog/[id]/page.tsx` (Generative Intel Section)
- `src/app/(admin)/admin/blog/new/page.tsx` (Generative Intel Section)

## 5. Safety & UI Preservation
- **Public Impact**: Zero. These fields are purely additive to the database. They allow for future JSON-LD expansion but do not change the current visual layout.
- **Existing Data**: All current fields in `site_config/global` and content collections are preserved.
- **Visuals**: Admin UI additions will follow the existing high-fidelity "Command Center" aesthetic.