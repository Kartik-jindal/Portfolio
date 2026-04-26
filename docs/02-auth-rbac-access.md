
# Authentication, RBAC, and Access Control

## 1. Authentication Flow
- **Provider**: Firebase Authentication.
- **Methods**: 
    - Google Sign-In (Primary for OAuth simplicity).
    - Email/Password (Fallback/Standard).
- **Session Management**: Client-side state managed via `AuthContext` with `onAuthStateChanged`. 

## 2. RBAC Strategy
- **Users Collection**: Every authenticated user's role is stored in a Firestore collection `users/{uid}`.
- **Roles**:
    - `SUPER_ADMIN`: Full access (Initially manually set for your email).
    - `ADMIN`: Full CMS access.
    - `GUEST`: Default role for unauthorized sign-ins.
- **Verification**: The `AdminLayout` and `AdminLoginPage` verify the role from the Firestore document immediately after Firebase Auth handshake.

## 3. Route Protection
- **Route Group**: `src/app/(admin)/admin`.
- **Logic**:
    - If user is not logged in: Redirect to `/admin/login`.
    - If user is logged in but `role !== 'ADMIN'`: Logout and show "Access Denied" toast.
    - If user is logged in and is admin: Render children.
- **Loading State**: A cinematic "Authenticating..." pulse screen prevents UI flickering during the session check.

## 4. Admin Shell Design
- **Theme**: High-fidelity dark mode matching the public portfolio.
- **Sidebar**: Collapsible navigation with lucide-react icons.
- **Pulse Stream**: A centralized activity log (visual placeholder for now).
- **Security Logs**: All session actions are visually treated as "Command Center" operations.

## 5. Deployment & Configuration
- **Env Vars Required**:
    - `NEXT_PUBLIC_FIREBASE_API_KEY`
    - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
    - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
    - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
    - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
    - `NEXT_PUBLIC_FIREBASE_APP_ID`

## 6. Implementation Notes
- **User Promotion**: To grant admin access initially, you must create a document in Firestore:
  ```json
  // users/[your-uid]
  {
    "email": "your-email@example.com",
    "role": "SUPER_ADMIN",
    "displayName": "Your Name"
  }
  ```
- **Middleware**: Client-side layout guarding was chosen for its better integration with the existing Framer Motion/Context logic, though Server Middleware can be added later for API-level protection.

## 7. Next Stage Instructions
1. Implement the **Site Configuration** settings page.
2. Build the **Experience** CRUD (simplest content model) to establish the form patterns.
3. Reference `docs/01-data-model-rbac-storage.md` for specific field schemas.
