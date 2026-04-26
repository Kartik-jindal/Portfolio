# System Audit and Constraints: Kartik Jindal Cinematic Portfolio

## 1. Current Frontend Architecture Summary
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS with a custom Shadcn UI theme (HSL variables in `globals.css`).
- **Motion/Interactions**: 
    - **Framer Motion**: Page transitions, scroll reveals, and entrance animations.
    - **GSAP**: Orchestrated timelines for complex interactions.
    - **Three.js**: Global background environment (`Hero3D`).
    - **Custom Cursor**: Global interactive element with high z-index.
- **Content State**: Currently hardcoded in component files or local arrays (e.g., `src/app/work/page.tsx`, `src/components/portfolio/projects.tsx`).
- **Layout**: Single-page primary flow with deep-link sub-pages for Work and Blog.

## 2. Protected Files (DO NOT MODIFY VISUALLY)
These files define the "Soul" of the site and must not have their CSS, motion logic, or JSX structure altered:
- `src/app/globals.css`: Theme colors, glassmorphism, and cinematic typography.
- `src/components/portfolio/hero-3d.tsx`: The WebGL environment.
- `src/components/portfolio/custom-cursor.tsx`: Interaction logic.
- `src/components/portfolio/intro-screen.tsx`: The loading sequence.
- `src/components/portfolio/navbar.tsx`: Layout and navigation flow.
- `src/components/portfolio/footer.tsx`: Visual structure.
- `src/app/layout.tsx`: Root structure and global noise/3D overlays.

## 3. Safe Integration Points
- **Data Arrays**: Replace local `const` arrays in `projects.tsx`, `experience.tsx`, `blog/page.tsx`, etc., with Firestore fetch logic.
- **Client Components**: Use `useEffect` for data hydration to prevent hydration mismatches with Framer Motion.
- **Admin Routes**: New route group `src/app/(admin)/admin` for the CMS dashboard.
- **Auth Guards**: Middleware and high-level layout wrappers for protected routes.

## 4. Required Backend Modules (Firebase)
- **Authentication**: Firebase Auth (Google + Email/Password).
- **Database**: Cloud Firestore for structured content.
- **Storage**: Firebase Storage for project assets, blog images, and resume PDF.
- **Cloud Functions (Optional/Future)**: For email notifications or complex triggers.

## 5. Required Collections & Entities
- `site_config`: Global SEO, social links, resume URL, section visibility toggles.
- `projects`:
    - Type: Flagship vs Small/Experiment.
    - Fields: Title, Role, Desc, LongDesc, Methodology, Impact, Challenges (Array), Tech (Array), ImageURL, AccentColor, LiveURL.
- `blog_posts`:
    - Fields: Title, Slug, Date, ReadTime, Category, ImageURL, Summary, Content (HTML/Markdown), Status (Draft/Published).
- `experience`:
    - Fields: Company, Role, Period, Desc, Order.
- `testimonials`:
    - Fields: Name, Position, Text, Avatar (Initials/Image).
- `contact_leads`:
    - Fields: Name, Email, Subject, Message, Timestamp, Status (New/Read).

## 6. Required Pages & Routes
- `/`: Home (Data-driven).
- `/work`: Full Portfolio (Data-driven).
- `/blog`: Journal Archive (Data-driven).
- `/blog/[slug]`: Post Detail (Data-driven).
- `/admin`: Dashboard (Auth required).
- `/admin/login`: Auth page.
- `/admin/projects`: CRUD.
- `/admin/blog`: CRUD.
- `/admin/leads`: View/Manage contacts.
- `/admin/settings`: Global site controls.

## 7. Required Environment Variables
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `FIREBASE_ADMIN_SDK_SERVICE_ACCOUNT` (Server-side)

## 8. Assumptions & Constraints
- **Confirmed**: Vercel is the deploy target.
- **Confirmed**: Firebase is the chosen backend provider.
- **Confirmed**: Initial admin is the user's email only.
- **Assumption**: "Resume editable" means updating a link or re-uploading a PDF, not a full resume builder.
- **Constraint**: No changes to the `Three.js` scene parameters unless data-driven (e.g., changing colors via CMS).

## 9. STRICT: DO NOT CHANGE
- Do not change the HSL variables in `globals.css`.
- Do not remove the `IntroScreen` or `CustomCursor`.
- Do not change the `framer-motion` variants (e.g., durations/easings).
- Do not change the typography hierarchy.

## 10. Next Stage Instructions
1. Initialize Firebase inside the project (Shared client config).
2. Setup Firebase Auth wrappers.
3. Build the `/admin` login page and protected layout.
4. Implement the `site_config` collection to handle global visibility and SEO before moving to content CRUD.
5. Reference this document for every logic implementation.