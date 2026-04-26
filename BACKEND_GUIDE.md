# Architectural Management System: Backend Guide

This document provides a technical overview and setup guide for the Firebase-backed infrastructure integrated into your cinematic portfolio.

## 1. Core Services

We utilize **Firebase** (Google's Cloud Platform) to power the portfolio's dynamic capabilities:
- **Authentication**: Secure access to the Admin Dashboard via Google Sign-In and Email/Password.
- **Cloud Firestore**: A NoSQL database storing your projects, journal entries, career timeline, and site settings.
- **Firebase Storage**: Secure hosting for project imagery and your resume PDF.

---

## 2. Environment Variables (.env.local) [✅ COMPLETED]

The connection between your frontend and Firebase has been established.

| Key | Status |
|-----|--------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | ✅ Linked |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | ✅ Linked |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | ✅ Linked |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | ✅ Linked |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | ✅ Linked |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | ✅ Linked |

---

## 3. Initial Setup & Admin Access

To gain access to the `/admin` command center, follow these steps:

1. ✅ **Create Firebase Project**: [Completed]
2. ✅ **Enable Services**: [Completed] Auth (Email/Password), Firestore, and Storage enabled.
3. ⏳ **Create Your User**:
   - Go to your **Firebase Console** -> **Authentication**.
   - Click **Add User**.
   - Email: `kartikjindal2003@gmail.com`
   - Password: `Student@9716838500`
4. ⏳ **Sign-In**: 
   - Navigate to `/admin/login` on your local build.
   - Sign in with the credentials above.
   - **Note**: The system is programmed to automatically grant `SUPER_ADMIN` status to this specific email on your first login.

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
