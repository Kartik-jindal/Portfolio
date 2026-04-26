
# CMS Dashboard and Editors Specification

## 1. Dashboard Architecture
The admin dashboard is built as a protected route group `/(admin)/admin` using the `AdminLayout`. It features a persistent sidebar for navigation and a main content area that dynamically renders CRUD interfaces for various site modules.

## 2. Sidebar Navigation Sections
- **Overview**: Real-time metrics and system pulse.
- **Projects**: Manage Flagship and Experimental builds.
- **Journal**: Full CMS for blog posts with markdown/HTML support.
- **Leads**: Inbox for contact form submissions.
- **Settings**: Global SEO, Socials, Resume, and Section Visibility.

## 3. Content Modules & Editor Flows

### 3.1 Project Manager (`/admin/projects`)
- **CRUD Implementation**: Support for adding new projects (`/admin/projects/new`) and editing existing ones (`/admin/projects/[id]`).
- **Fields**: Title, Slug, Type (Flagship/Experiment), Role, Short Description, Long Description, Methodology, Impact, Challenges (Array), Tech (Array), Live URL, GitHub URL, Accent Color, Image URL.
- **Media**: Integrated Firebase Storage uploads for cover images.

### 3.2 Journal (Blog) Editor (`/admin/blog`)
- **CRUD Implementation**: Support for new entries (`/admin/blog/new`) and editorial updates (`/admin/blog/[id]`).
- **Fields**: Title, Slug, Category, Date, Read Time, Image, Image Hint, Summary, Content (Markdown/HTML).
- **Workflow**: Supports 'Draft' and 'Published' statuses for scheduled launches.

### 3.3 Site Settings & SEO
- **SEO**: Meta titles, descriptions, and keywords.
- **Socials**: Centralized link management for footer and contact points.
- **Resume**: Direct PDF upload management via Firebase Storage.
- **Visibility**: Toggles for Testimonials, Experience, and experimental sections.

## 4. Technical Implementation Notes
- **Data Persistence**: Uses Firebase Firestore Client SDK for real-time updates and low latency.
- **File Management**: Firebase Storage handles project assets and resumes with public read access.
- **Draft Logic**: Public queries filter for `status == 'published'` to protect work-in-progress content.

## 5. Next Stage Instructions
1. **Content Migration**: Use the editors to populate your real projects and blog posts.
2. **SEO Verification**: Verify metadata rendering in the public site after updating CMS settings.
3. **Lead Testing**: Perform a live test of the contact form and verify payload delivery in the Leads inbox.
