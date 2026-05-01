# ✨ Cinematic Portfolio & Blog Engine

A high-performance, white-label portfolio and blog platform built with **Next.js 15**, featuring a custom CMS, AI-optimized SEO (GEO/AEO), and high-end cinematic motion design. This system is engineered for scalability, ease of reuse, and professional-grade performance.

---

## 🚀 Key Features

### 🌐 Public Experience
*   **Cinematic UI**: Immersive 3D hero sections powered by Three.js and fluid, staggered animations via Framer Motion.
*   **Dynamic Portfolio**: Showcase flagship projects and experiments with deep-dive case studies.
*   **AI-Optimized Blog**: Fully responsive blog with dynamic routing, optimized for both Google and AI answer engines.
*   **Lead Capture**: Integrated contact systems and lead tracking for business growth.
*   **Premium Interactions**: Custom cursor behavior, scroll-linked animations, and seamless page transitions.

### 🛠️ Admin Dashboard (CMS)
*   **Content Management**: Full CRUD operations for Projects, Blog Posts, Experience, and Testimonials.
*   **Strategy Controls**: Dedicated interfaces for SEO, GEO, and AEO metadata management.
*   **Media Pipeline**: Secure, server-side asset uploads directly to AWS S3.
*   **Leads Management**: A centralized dashboard to view and manage incoming inquiries.
*   **Global Configuration**: Toggle UI sections and update site-wide settings in real-time.
*   **Media Management**: Centralized S3-backed library with dual-source (Upload/Select) integration for all content editors.

---

## 💻 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router), React 19 |
| **Styling** | Tailwind CSS, shadcn/ui, Radix UI |
| **Animation** | Framer Motion, Three.js, GSAP |
| **Database** | Firebase Firestore |
| **Storage** | AWS S3 (Private Bucket via OAC) |
| **CDN** | Amazon CloudFront (assets.kartikjindal.site) |
| **Auth** | Custom HMAC-signed sessions |
| **AI Integration** | Genkit + Google Gemini |

---

## 🏗️ Architecture Overview

The platform utilizes the **Next.js 15 App Router** with a modular "Route Group" structure to maintain a strict boundary between public-facing pages and the administrative dashboard.

*   **Boundary Separation**: Using `(public)` and `(admin)` route groups ensures clean middleware application and layout isolation.
*   **Server-Centric Logic**: Heavy use of **React Server Components (RSC)** for data fetching and **Server Actions** for mutations (S3/Firestore).
*   **Secure Auth**: A bespoke session management system using HMAC-signed HTTP-only cookies, bypassing external auth provider overhead.
*   **Asset Management**: Decoupled storage strategy using AWS S3 for binary assets to ensure low-latency delivery and cost-efficiency.

---

## 📂 Project Structure

```bash
src/
├── app/            # Public routes and (admin) dashboard groups
├── components/     # UI primitives and high-level domain blocks
├── lib/            # Firebase, AWS S3 actions, and core utilities
├── hooks/          # Custom UI and interaction state hooks
├── context/        # Shared application context (Auth, UI state)
└── ai/             # Genkit AI flows and configuration
```

---

## ⚙️ Setup Instructions

### 1. Installation
```bash
npm install
```

### 2. Environment Configuration
Create a `.env.local` file with the following required keys:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=

# AWS S3 Storage
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_S3_BUCKET_NAME=

# Security
SESSION_SECRET=    # For HMAC cookie signing
GOOGLE_API_KEY=    # For AI/Genkit features
```

### 3. Development
```bash
npm run dev
```

---

## 🚀 Deployment

The system is optimized for **Vercel** or **Firebase App Hosting**. 

1.  Configure environment variables in your provider dashboard.
2.  Ensure AWS S3 bucket CORS policies allow your production domain.
3.  Set up Firebase Firestore rules to permit access from your server environment.

---

## 💎 What Makes This Project Valuable

*   **White-Label Foundation**: Built with CSS variables and design tokens, making it trivial to rebrand for different clients.
*   **GEO/AEO Integration**: One of the few templates built from the ground up for **Generative Engine Optimization**, ensuring visibility in AI-generated answers.
*   **Performance-First**: Implements best practices for Next.js 15, including selective hydration and optimized image delivery via S3.
*   **Product-Ready**: A complete, sellable solution for high-end digital agencies or developers.

---

## 👨‍💻 Author

**Kartik Jindal**
Full-Stack Developer & Designer

---

## 🔮 Future Roadmap
*   [Inferred] Advanced analytics dashboard for tracking content performance.
*   [Inferred] Automated email notification system for new leads.
*   [Inferred] Multi-role administrative access levels.
