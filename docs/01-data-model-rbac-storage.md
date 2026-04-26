# Backend Data Model, RBAC, and Storage Specification

## 1. Firebase Service Selection
- **Cloud Firestore**: Primary NoSQL database for structured content (Projects, Blog, Experience, Config). Chosen for real-time capabilities and generous free tier.
- **Firebase Authentication**: Email/Password + Google Sign-In.
- **Firebase Storage**: For media assets (Images, Resume PDF).
- **Firebase Security Rules**: Granular control over document access.

## 2. Authentication & Role Model
### Roles
- `SUPER_ADMIN`: Initial owner (your email). Full access to everything including user management.
- `ADMIN`: (Future) Full access to CMS/Leads, but cannot manage other admins.
- `GUEST`: Public read-only access to published content.

### User Document Schema (`users/{uid}`)
```typescript
{
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN';
  displayName: string;
  photoURL: string;
  createdAt: Timestamp;
}
```

## 3. Firestore Collection Schema

### 3.1 `site_config/global` (Single Document)
*Mirrors global settings and section toggles.*
```typescript
{
  seo: {
    defaultTitle: string; // e.g., "Kartik Jindal | Full Stack Architect"
    defaultDescription: string;
    keywords: string[];
    ogImage: string; // URL
  },
  resume: {
    fileUrl: string;
    updatedAt: Timestamp;
  },
  socials: {
    github: string;
    twitter: string;
    linkedin: string;
    instagram: string;
    email: string;
  },
  visibility: {
    showTestimonials: boolean;
    showExperience: boolean;
    showExperiments: boolean;
    isMaintenanceMode: boolean;
  }
}
```

### 3.2 `projects` (Collection)
*Mirrors the current flagship and small project structures.*
```typescript
{
  id: string; // "01", "02" etc or auto-ID
  slug: string; // URL friendly name
  title: string;
  type: 'FLAGSHIP' | 'EXPERIMENT';
  role: string;
  desc: string; // Short excerpt
  longDesc: string; // Markdown/HTML content
  methodology?: string;
  impact?: string;
  challenges: string[];
  tech: string[];
  image: string; // URL
  accentColor: string; // hex/hsl
  liveUrl: string;
  githubUrl: string;
  status: 'draft' | 'published';
  order: number; // For manual sorting
  createdAt: Timestamp;
}
```

### 3.3 `blog` (Collection)
```typescript
{
  slug: string;
  title: string;
  date: string; // Display date
  readTime: string;
  category: string;
  image: string;
  imageHint: string;
  summary: string;
  content: string; // Markdown/HTML
  status: 'draft' | 'published';
  seo: {
    title: string;
    description: string;
  },
  createdAt: Timestamp;
}
```

### 3.4 `experience` (Collection)
```typescript
{
  company: string;
  role: string;
  period: string;
  desc: string;
  order: number;
}
```

### 3.5 `contact_leads` (Collection)
```typescript
{
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'archived';
  createdAt: Timestamp;
  metadata: {
    userAgent: string;
    ipHash: string; // For spam tracking
  }
}
```

## 4. Storage Folder Strategy
- `/resumes/`: Latest resume PDF.
- `/projects/`: Cover images and gallery assets.
- `/blog/`: Post headers and inline images.
- `/avatars/`: Testimonial or admin photos.

## 5. Security Rules Strategy
- **Public**: `allow read` if `status == 'published'` or collection is `site_config`, `experience`, `testimonials`.
- **Contact Leads**: `allow create` for everyone (with honeypot/validation). No read access.
- **Admin**: `allow read, write` if `request.auth != null` and `request.auth.token.role == 'ADMIN'`.

## 6. Route Structure Plan
### Public
- `/`: Home (Reads from `site_config`, `experience`, `projects[limit=3]`).
- `/work`: Archive (Reads all `published` projects).
- `/blog`: Archive (Reads all `published` posts).
- `/blog/[slug]`: Detail (Draft preview supported via token).

### Admin (New)
- `/(admin)/admin/login`: Auth page.
- `/(admin)/admin/dashboard`: Metrics/Overview.
- `/(admin)/admin/projects`: CRUD table.
- `/(admin)/admin/blog`: CRUD table.
- `/(admin)/admin/leads`: Message inbox.
- `/(admin)/admin/settings`: Global site config.

## 7. Assumptions & Constraints
- **Validation**: Zod will be used on both client and server actions for all CMS writes.
- **Draft Preview**: Implemented using a temporary JWT or secret query param (`?preview=true&secret=...`) to allow the Detail pages to fetch `status == 'draft'` content.
- **Spam Protection**: Honeypot field in the Contact form + Firestore rate limiting via Cloud Functions (future) or simple timestamp checks.

## 8. Next Stage Instructions
1. Initialize Firebase Client SDK in `src/lib/firebase/config.ts`.
2. Implement Firebase Auth Context Provider in `src/context/auth-context.tsx`.
3. Create the `/(admin)/admin/login` page.
4. Setup the `AdminLayout` with the requested sidebar and protected route logic.
5. Create a basic "Site Config" settings page to verify the data wiring.
