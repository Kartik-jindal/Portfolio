# CMS Dashboard and Editors Specification

## 1. Dashboard Architecture
The admin dashboard is built as a protected route group `/(admin)/admin` using the `AdminLayout`. It features a persistent sidebar for navigation and a main content area that dynamically renders CRUD interfaces for various site modules.

## 2. Sidebar Navigation Sections
- **Overview**: Real-time metrics and system pulse.
- **Projects**: Manage Flagship and Experimental builds.
- **Journal**: Full CMS for blog posts with markdown support.
- **Leads**: Inbox for contact form submissions.
- **Experience**: Manage career timeline entries.
- **Settings**: Global SEO, Socials, Resume, and Section Visibility.

## 3. Content Modules & Editor Flows

### 3.1 Project Manager
- **Fields**: Title, Slug, Type (Flagship/Experiment), Role, Short Description, Long Description (Markdown), Methodology, Impact, Challenges (Array), Tech (Array), Live URL, GitHub URL, Accent Color, Image URL.
- **Logic**: Flagship projects appear in the main "Selected Works" section, while Experiments appear in the "Technical Lab" section.

### 3.2 Journal (Blog) Editor
- **Fields**: Title, Slug, Category, Date, Read Time, Image, Image Hint, Summary, Content (Markdown).
- **Workflow**: Supports 'Draft' and 'Published' statuses for scheduled launches.

### 3.3 Experience Manager
- **Fields**: Company, Role, Period, Description, Sort Order.
- **Ordering**: Uses a numeric `order` field for manual career sequence control.

### 3.4 Site Settings & SEO
- **SEO**: Meta titles, descriptions, and keywords.
- **Socials**: Centralized link management for footer and contact points.
- **Resume**: Direct PDF URL update or upload management.
- **Visibility**: Toggles for Testimonials, Experience, and experimental sections.

## 4. Technical Implementation Notes
- **Forms**: Powered by `react-hook-form` and `zod` for strict schema validation.
- **UI Components**: Built using Radix UI / Shadcn for accessibility and performance.
- **Data Persistence**: Direct Firestore integration using the Firebase Client SDK for real-time updates.
- **Draft/Publish**: All public fetching logic must filter for `status == 'published'` unless a preview secret is provided.

## 5. Next Stage Instructions
1. **Wire Public Pages**: Replace hardcoded data in `src/app/page.tsx`, `src/app/work/page.tsx`, and `src/app/blog/page.tsx` with Firestore fetch calls.
2. **Contact Form Hook**: Update the public `Contact` component to write directly to the `contact_leads` collection.
3. **Draft Preview Route**: Implement `/api/preview` to allow admin-only viewing of draft content.
