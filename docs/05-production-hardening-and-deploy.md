
# Production Hardening and Deployment Specification

## 1. Asset Storage Strategy
- **Service**: Firebase Storage.
- **Paths**:
    - `/projects/`: Cover images and high-fidelity assets.
    - `/blog/`: Post headers and technical diagrams.
    - `/resumes/`: PDF resume storage.
    - `/config/`: OG images and global branding assets.
- **Access Control**: Public read for assets linked in Firestore; authenticated write for Admins.

## 2. Lead Management & Spam Protection
- **Honeypot**: A hidden `hp` field in the Contact Form traps bot submissions silently.
- **Validation**: All submissions are sanitized and stored in `contact_leads`.
- **Metadata**: Capture user agent and platform to identify lead quality.

## 3. SEO & Metadata
- **Dynamic Meta**: `generateMetadata` in `page.tsx` and `blog/[slug]/page.tsx` pulls live SEO data.
- **Open Graph**: Optimized for 1200x630 imagery with Twitter Card support.
- **Sitemap**: Auto-generated via `sitemap.ts`, covering static routes and dynamic blog slugs.
- **Robots**: Configured via `robots.ts` to allow indexing of public content while protecting the `/admin` command center.

## 4. Environment Variables
Ensure these are set in Vercel/Production:
```bash
NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
NEXT_PUBLIC_FIREBASE_PROJECT_ID="..."
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="..."
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
NEXT_PUBLIC_FIREBASE_APP_ID="..."
```

## 5. Security Checklist
- [x] Firestore Rules: Public read for published content; Admin-only write.
- [x] Storage Rules: Auth-only write access.
- [x] Honeypot field implemented.
- [x] Protected route group for Admin.
- [x] Error boundaries for Firebase server-side connection issues.

## 6. Final Operational Notes
- **Deployment Target**: Vercel.
- **Data Hydration**: Server-side fetching for SEO, Client-side hydration for motion-heavy sections.
- **Maintenance**: Periodically clear archived leads from the CMS dashboard.
