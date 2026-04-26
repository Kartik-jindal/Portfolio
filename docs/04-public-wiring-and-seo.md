
# Public Wiring and SEO Specification

## 1. Dynamic Content Summary
The following public sections are now fully driven by CMS data stored in Firebase:
- **Global Config**: SEO Metadata, Social Links, Resume URL, and Section Visibility.
- **Projects**: Flagship builds and Technical Experiments.
- **Journal**: Blog posts with markdown content and slug-based routing.
- **Experience**: Professional career timeline.
- **Testimonials**: Client feedback.
- **Contact**: Submissions are stored in `contact_leads`.

## 2. Data Flow Architecture
- **Server Components (RSC)**: `src/app/page.tsx` uses server-side fetching for initial payloads (SEO, first 3 projects, etc.) to ensure optimal performance and SEO indexing.
- **Client Hydration**: Components like `Projects`, `Experience`, and `Testimonials` accept `initialData` as props but can fall back to client-side fetching if needed, maintaining hydration safety for Framer Motion.
- **Slug-based Routing**: Blog posts utilize a dynamic route `[slug]` which searches Firestore by `slug` field with a fallback to document `id`.

## 3. SEO Strategy
- **Dynamic Metadata**: The `generateMetadata` function in `page.tsx` and `blog/[slug]/page.tsx` pulls SEO titles, descriptions, and keywords directly from the `site_config` and `blog` collections.
- **Static vs Dynamic**: The site is rendered dynamically by default to support real-time CMS updates, but caching headers are implemented for Vercel edge performance.

## 4. Feature Logic
- **Flagship vs Experiment**: Filtered via the `type` field in the `projects` collection.
- **Draft/Publish**: All public queries include a `where('status', '==', 'published')` filter.
- **Visibility Toggles**: The `site_config/global` visibility flags control the rendering of major homepage sections.

## 5. Fallback Strategy
- **Empty States**: Graceful "No items found" or hidden sections prevent layout breakage.
- **Placeholder Images**: Uses `picsum.photos` with seeds if CMS images are missing.
- **Loading UI**: Cinematic pulse loaders are used during client-side data resolution.

## 6. Next Stage Instructions
1. **Media Optimization**: Implement a cloud-based image optimization strategy (e.g., using Firebase Storage extensions or Next.js Image optimization).
2. **Contact Notifications**: Set up a Cloud Function to trigger email alerts for new leads.
3. **Deployment**: Finalize environment variable configurations on Vercel and verify the full CMS-to-Public lifecycle.
