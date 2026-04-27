# Admin Panel Fact Base (Questions 1–60)

## Executive Summary
The portfolio features a custom-built administrative dashboard integrated with Firebase Authentication and Cloud Firestore. It follows a "Command Center" aesthetic, providing granular control over both content and search engine parameters. Almost every visible string and asset on the public site is managed through this panel.

- **Admin System**: Custom React-based CMS within the Next.js app group `(admin)`.
- **Content Areas**: Hero, About, Projects, Experience, Testimonials, Contact, Blog, Navigation, and Global Settings.
- **Biggest Strengths**: Integrated "SEO HUD" for real-time scoring, S3-backed asset management, and dynamic "Knowledge Graph" (GEO) wiring.
- **Biggest Missing Capabilities**: Bulk actions, content duplication, post scheduling, and built-in FAQ/Schema-specific block editors.
- **SEO Readiness Level**: High for item-level metadata; currently undergoing structural upgrades to resolve route-level indexing gaps for projects.

---

# A. Current Admin Structure

## 1. What admin sections currently exist?
| Section | Route | File Path |
|:---|:---|:---|
| **Overview** | `/admin` | `src/app/(admin)/admin/page.tsx` |
| **Hero Section** | `/admin/hero` | `src/app/(admin)/admin/hero/page.tsx` |
| **About Story** | `/admin/about` | `src/app/(admin)/admin/about/page.tsx` |
| **Projects** | `/admin/projects` | `src/app/(admin)/admin/projects/page.tsx` |
| **Experience** | `/admin/experience` | `src/app/(admin)/admin/experience/page.tsx` |
| **Voices (Testimonials)** | `/admin/testimonials` | `src/app/(admin)/admin/testimonials/page.tsx` |
| **Contact Module** | `/admin/contact` | `src/app/(admin)/admin/contact/page.tsx` |
| **Journal (Blog)** | `/admin/blog` | `src/app/(admin)/admin/blog/page.tsx` |
| **Layout Config** | `/admin/interface` | `src/app/(admin)/admin/interface/page.tsx` |
| **SEO Command** | `/admin/seo` | `src/app/(admin)/admin/seo/page.tsx` |
| **Leads (Inbox)** | `/admin/leads` | `src/app/(admin)/admin/leads/page.tsx` |
| **Settings** | `/admin/settings` | `src/app/(admin)/admin/settings/page.tsx` |

## 2. Which admin section controls homepage content?
Homepage content is modularly distributed across several sections: **Hero Section**, **About Story**, **Projects** (Flagship limit), **Experience**, **Voices**, and **Contact Module**.

## 3. Which section controls projects/work content?
The **Projects** section (`/admin/projects`) manages the `projects` collection, which feeds both the homepage highlights and the `/work` archive.

## 4. Which section controls blog posts?
The **Journal** section (`/admin/blog`) manages the `blog` collection.

## 5. Is there a dedicated SEO section?
Yes.
- **Routes**: `/admin/seo`
- **Files**: `src/app/(admin)/admin/seo/page.tsx`
- **Editable Fields**: Global Default Title, Default Description, Global Keywords, Page-specific Title/Description/Keywords for Home, Work, and Blog routes.
- **Data Source**: Firestore `site_config/seo_pages` and `site_config/global`.
- **Public Impact**: Controls the `generateMetadata` output for the root routes.

---

# B. Blog Editable Fields

| Question | Field Exists? | File Path | Data Source | Public Usage | Notes |
|:---|:---|:---|:---|:---|:---|
| 6. title | Yes | `admin/blog/[id]/page.tsx` | `blog/{id}.title` | H1/Metadata | Primary identity |
| 7. slug | Yes | `admin/blog/[id]/page.tsx` | `blog/{id}.slug` | URL Path | Auto-generated or manual |
| 8. content/body | Yes | `admin/blog/[id]/page.tsx` | `blog/{id}.content` | Article Prose | Supports HTML/Markdown |
| 9. featured image | Yes | `admin/blog/[id]/page.tsx` | `blog/{id}.image` | OG/Hero | S3 public URL |
| 10. meta title | Yes | `admin/blog/[id]/page.tsx` | `blog/{id}.seo.title` | `<title>` tag | Part of SEO map |
| 11. meta description | Yes | `admin/blog/[id]/page.tsx` | `blog/{id}.seo.description`| `<meta desc>` | Part of SEO map |
| 12. canonical URL | Yes | `admin/blog/[id]/page.tsx` | `blog/{id}.seo.canonicalUrl`| `<link rel>` | Overrides default |
| 13. noindex toggle | Yes | `admin/blog/[id]/page.tsx` | `blog/{id}.seo.indexable` | robots meta | Boolean toggle |
| 14. tags | No | N/A | N/A | N/A | Categories used instead |
| 15. category | Yes | `admin/blog/[id]/page.tsx` | `blog/{id}.categories` | Labeling | Multi-select array |
| 16. author | No | `admin/settings/page.tsx` | `global.identity` | JSON-LD | Global site setting |
| 17. publish date | Yes | `admin/blog/[id]/page.tsx` | `blog/{id}.date` | UI Display | User-defined string |
| 18. updated date | No | N/A | `updatedAt` | Backend only | Managed by Firestore |
| 19. alt text | Yes | `admin/blog/[id]/page.tsx` | `blog/{id}.altText` | `<img> alt` | Added for SEO Phase 1 |
| 20. FAQ blocks | No | N/A | N/A | N/A | Inferred Gap |

---

# C. Project Editable Fields

| Question | Field Exists? | File Path | Data Source | Public Usage | Notes |
|:---|:---|:---|:---|:---|:---|
| 21. project title | Yes | `admin/projects/[id]/page.tsx` | `projects/{id}.title` | H1/Label | Primary identity |
| 22. slug | Yes | `admin/projects/[id]/page.tsx` | `projects/{id}.slug` | URL Path | Critical for indexing |
| 23. description | Yes | `admin/projects/[id]/page.tsx` | `projects/{id}.desc` | Excerpt | Used in card/meta |
| 24. case study content| Yes | `admin/projects/[id]/page.tsx` | `projects/{id}.longDesc` | Detail View | The full narrative |
| 25. thumbnail | Yes | `admin/projects/[id]/page.tsx` | `projects/{id}.image` | Card/OG | Primary asset |
| 26. gallery images | No | N/A | N/A | N/A | Single image only |
| 27. tech stack | Yes | `admin/projects/[id]/page.tsx` | `projects/{id}.tech` | Skills list | Array of strings |
| 28. results/outcomes | Yes | `admin/projects/[id]/page.tsx` | `projects/{id}.impact` | Methodology | Specific impact block |
| 29. live URL | Yes | `admin/projects/[id]/page.tsx` | `projects/{id}.liveUrl` | Link | External redirect |
| 30. GitHub URL | Yes | `admin/projects/[id]/page.tsx` | `projects/{id}.githubUrl` | Link | External redirect |
| 31. meta title | Yes | `admin/projects/[id]/page.tsx` | `projects/{id}.seo.title` | `<title>` tag | Part of SEO map |
| 32. meta description | Yes | `admin/projects/[id]/page.tsx` | `projects/{id}.seo.description`| `<meta desc>` | Part of SEO map |
| 33. canonical | Yes | `admin/projects/[id]/page.tsx` | `projects/{id}.seo.canonicalUrl`| `<link rel>` | Overrides default |
| 34. noindex | Yes | `admin/projects/[id]/page.tsx` | `projects/{id}.seo.indexable` | robots meta | Boolean toggle |
| 35. alt text | Yes | `admin/projects/[id]/page.tsx` | `projects/{id}.altText` | `<img> alt` | Added for SEO Phase 1 |
| 36. FAQ / Q&A | No | N/A | N/A | N/A | Inferred Gap |

---

# D. Global Settings Fields

| Question | Field Exists? | File Path | Data Source | Public Usage | Notes |
|:---|:---|:---|:---|:---|:---|
| 37. Name | Yes | `admin/settings/page.tsx` | `global.identity.authorName`| Schema/SEO | Author entity name |
| 38. Job Title | Yes | `admin/settings/page.tsx` | `global.identity.jobTitle` | Schema/SEO | Entity professional role|
| 39. Brand Desc | Partial | `admin/seo/page.tsx` | `global.seo.defaultDescription`| Meta Desc | Global site summary |
| 40. Email | Yes | `admin/settings/page.tsx` | `global.socials.email` | Footer/Mailto | Primary contact link |
| 41. Phone | No | N/A | N/A | N/A | Not implemented |
| 42. Social Links | Yes | `admin/settings/page.tsx` | `global.socials.*` | Footer/Schema | GH, LI, TW, IG |
| 43. sameAs links | Partial | `src/app/page.tsx` | `global.socials` | JSON-LD | Derived from socials |
| 44. Logo | No | N/A | N/A | N/A | Text-based brand used |
| 45. Location | No | N/A | N/A | N/A | Remote focus |
| 46. Services Offered | No | N/A | N/A | N/A | Expressed via About |
| 47. Skills / Expertise| Yes | `admin/about/page.tsx` | `about.skills` | Arsenal List | Array of strings |

---

# E. Homepage / Static Sections

| Question | Field Exists? | File Path | Data Source | Public Usage | Notes |
|:---|:---|:---|:---|:---|:---|
| 48. Hero heading | Yes | `admin/hero/page.tsx` | `hero.titleMain` | H1 Section | Solid text part |
| 49. Hero subheading | Yes | `admin/hero/page.tsx` | `hero.description` | Hero Paragraph | Narrative intro |
| 50. CTA text | Yes | `admin/hero/page.tsx` | `hero.ctaPrimary` | Hero Button | Main conversion link |
| 51. About text | Yes | `admin/about/page.tsx` | `about.narrative1` | About Section | Primary brand story |
| 52. Testimonials | Yes | `admin/testimonials/page.tsx` | `testimonials` coll | Voice cards | CRUD managed |
| 53. Experience | Yes | `admin/experience/page.tsx` | `experience` coll | Path line | CRUD managed |
| 54. Featured projects| Partial | `src/app/page.tsx` | `projects` where FLAGSHIP| Homepage works | Auto-selected by type |
| 55. Featured blogs | No | N/A | N/A | N/A | Always sorted by date |

---

# F. Publishing Workflow

| Question | Field Exists? | File Path | Data Source | Public Usage | Notes |
|:---|:---|:---|:---|:---|:---|
| 56. Draft Status | Yes | `admin/blog/[id]/page.tsx` | `{coll}.status` | Filtered Query | `draft` vs `published` |
| 57. Schedule posts | No | N/A | N/A | N/A | Immediate sync only |
| 58. Featured toggle | No | `admin/projects/[id]/page.tsx`| `projects.type` | Selection | Type FLAGSHIP used |
| 59. Reorder items | Yes | `admin/interface/page.tsx`| `{coll}.order` | UI Sorting | Drag-drop or numeric |
| 60. Duplicate entries| No | N/A | N/A | N/A | Must create new |

---

# G. Hidden / Partial / Unused Capabilities

- **`imageHint`**: Present in Blog/Project editors; used as a developer hint for placeholder images but not semantic for SEO (now superseded by `altText`).
- **`seo.indexable`**: Previously present in some schemas but not wired to the `robots` tag until SEO Phase 1 updates.
- **`about.stat1Value`**: Present in About editor but visually distinct from primary SEO identity markers.
- **`contact.labels.*`**: Extremely granular control over form field names, rarely seen in basic CMS setups.

---

# H. Confirmed vs Inferred vs Unknown

### Confirmed
- Full CRUD for Blog, Projects, Experience, and Testimonials.
- S3 integration for all image uploads via Server Actions.
- Modular homepage sections managed via specific `site_config` documents.
- Granular SEO maps (`title`, `description`, `keywords`, `ogImage`, `indexable`, `canonicalUrl`) in content collections.

### Inferred
- The system is designed to be extensible; adding "FAQ" or "Structured Data" fields would require minimal Firestore schema changes.
- `identity` markers are intended to be the "Entity Truth" for AI search engines.

### Unknown
- Max payload limits for S3 uploads (handled by Next.js Server Action defaults).
- Exact Firestore query costs at scale for real-time dashboard updates.

---

# I. File Reference Index

| File Path | Admin Control Purpose |
|:---|:---|
| `src/app/(admin)/admin/hero/page.tsx` | Homepage H1, Badge, and Primary CTA content. |
| `src/app/(admin)/admin/about/page.tsx` | Narrative story, Skills arsenal, and Vision quote. |
| `src/app/(admin)/admin/projects/page.tsx`| Portfolio list and build status overview. |
| `src/app/(admin)/admin/projects/[id]/page.tsx`| Deep project metadata, narrative, tech, and specific SEO tags. |
| `src/app/(admin)/admin/blog/page.tsx` | Journal archive and editorial status overview. |
| `src/app/(admin)/admin/blog/[id]/page.tsx` | Article content, categories, and specific SEO tags. |
| `src/app/(admin)/admin/seo/page.tsx` | Route-level overrides and Global SEO fallbacks. |
| `src/app/(admin)/admin/settings/page.tsx` | Entity Identity (Name/Title), Social Links, and Resume S3 Sync. |
| `src/app/(admin)/admin/interface/page.tsx`| Navbar and Footer structural navigation items. |
| `src/app/(admin)/admin/leads/page.tsx` | Client transmission log and metadata inspector. |
| `src/components/admin/seo-hud.tsx` | Real-time score validator for metadata quality. |