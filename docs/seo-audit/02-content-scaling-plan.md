# Content Scaling Workflow Implementation Plan

## 1. Objectives
Streamline the management of high-volume project and blog content by introducing automation tools into the Admin Panel.

## 2. Identified Workflows for Upgrade

### A. Content Duplication (Cloning)
- **Problem**: Creating similar project case studies or blog series requires repetitive manual entry.
- **Solution**: Add a "Clone" action to list views.
- **Implementation**:
    - List view adds a `Copy` icon.
    - Redirects to `/new?clone=[id]`.
    - `new/page.tsx` fetches source data and initializes the form (stripping unique IDs/slugs).

### B. Bulk Operations
- **Problem**: Updating status (Draft/Published) or deleting multiple items is slow.
- **Solution**: Multi-select checkboxes with a floating action bar.
- **Actions**: Bulk Status Toggle, Bulk Delete.

### C. Advanced List Management
- **Problem**: Finding specific builds in a growing archive is difficult.
- **Solution**: 
    - Status filters (All / Published / Draft).
    - Type filters for Projects (Flagship / Experiment).

## 3. Files Affected
- `src/app/(admin)/admin/projects/page.tsx` (Bulk + Filters + Clone UI)
- `src/app/(admin)/admin/projects/new/page.tsx` (Cloning Logic)
- `src/app/(admin)/admin/blog/page.tsx` (Bulk + Filters + Clone UI)
- `src/app/(admin)/admin/blog/new/page.tsx` (Cloning Logic)

## 4. Safety & UI Preservation
- **Public Impact**: Zero. All changes are contained within the `(admin)` route group.
- **Data Integrity**: Cloning creates new documents; original data is never mutated during a clone operation.
- **Rollback**: Standard Git revert. No breaking Firestore migrations required.
