# Architectural Management System: Backend Guide

This document provides a technical overview and setup guide for the Firebase-backed infrastructure integrated into your cinematic portfolio.

## 1. Core Services

We utilize **Firebase** (Google's Cloud Platform) to power the portfolio's dynamic capabilities:
- **Authentication**: Secure access to the Admin Dashboard via Google Sign-In and Email/Password.
- **Cloud Firestore**: A NoSQL database storing your projects, journal entries, career timeline, and site settings.
- **Firebase Storage**: Secure hosting for project imagery and your resume PDF.

---

## 2. Environment Variables (.env.local) [✅ COMPLETED]

The connection between your frontend and Firebase has been established. Your `.env.local` file is now populated with the required project identifiers.

| Key | Status |
|-----|--------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | ✅ Linked |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | ✅ Linked |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | ✅ Linked |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | ✅ Linked |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | ✅ Linked |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | ✅ Linked |

---

## 3. Initial Setup & Admin Promotion

To gain access to the `/admin` command center, follow these remaining steps:

1. ✅ **Create Firebase Project**: [Completed] Project created on Firebase Console.
2. ✅ **Enable Services**: [Completed] Auth, Firestore, and Storage enabled.
3. ⏳ **First Sign-In**: Go to `/admin/login` on your local build and sign in with your email.
4. ⏳ **Grant Admin Role**:
   - Initially, you will be a `GUEST` and locked out.
   - Go to the **Firestore Console**.
   - Find the `users` collection (it will appear after your first login).
   - Find the document corresponding to your `uid`.
   - Change the `role` field from `"GUEST"` to `"SUPER_ADMIN"`.
   - Refresh the page to access the dashboard.

---

## 4. Operational Workflow

### Project Management
- **Flagship Builds**: These appear in the "Selected Works" section on the homepage.
- **Experiments**: These appear in the "Technical Lab" on the `/work` page.
- **Draft Mode**: Set status to `draft` to hide projects from the public eye while editing.

### The Journal (Blog)
- Supports **Markdown** content.
- Ensure your `slug` is URL-friendly (e.g., `modern-architecture-trends`).
- The system automatically generates SEO metadata and adds published posts to the `sitemap.xml`.

### Contact Leads
- Submissions from the public contact form appear in the **Leads** inbox.
- A **Honeypot** field is active to trap bot spam silently.
- Leads capture metadata (User Agent/Platform) to help identify high-quality inquiries.

### Global Settings
- Manage your **SEO Meta Tags** (Title, Description, Keywords) centrally.
- Upload your **Resume PDF** directly to Firebase Storage; the site will update the download link automatically.
- Use **Interface Toggles** to show or hide entire sections (like Testimonials or Experience) without editing code.

---

## 5. Security Summary

- **Public Access**: Read-only for `published` content.
- **Admin Access**: Authenticated `write` access restricted to users with the `ADMIN` or `SUPER_ADMIN` role.
- **Portals**: The custom cursor and cinematic overlays utilize high-z-index portals to ensure interactions remain consistent across all site layers.

---

## 6. Deployment (Vercel)

When deploying to Vercel, ensure all variables from `.env.local` are added to the **Project Settings -> Environment Variables** section. The build will automatically optimize your images and generate a static sitemap based on your live Firestore data.
