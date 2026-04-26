
# Architectural Management System: Backend Guide

This document provides a technical overview and setup guide for the Hybrid Infrastructure (Firebase + AWS) integrated into your cinematic portfolio.

## 1. Core Services

We utilize a multi-cloud strategy to power the portfolio's dynamic capabilities:
- **Firebase Authentication**: Secure access to the Admin Dashboard via Google Sign-In and Email/Password.
- **Cloud Firestore**: A NoSQL database storing your projects, journal entries, career timeline, and site settings.
- **AWS S3**: High-performance storage for project imagery, blog assets, and your resume PDF.

---

## 2. Environment Variables (.env.local)

The following variables must be configured for the Command Center to operate.

### Firebase Credentials
| Key | Purpose |
|-----|---------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Public Firebase API access |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Auth redirect domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firestore/Auth Project ID |

### AWS S3 Credentials (Server-Side)
| Key | Purpose |
|-----|---------|
| `AWS_REGION` | e.g. `us-east-1` |
| `AWS_ACCESS_KEY_ID` | IAM User Access Key |
| `AWS_SECRET_ACCESS_KEY` | IAM User Secret Key |
| `AWS_S3_BUCKET_NAME` | Your unique S3 Bucket name |

---

## 3. AWS S3 Setup Guide

To ensure your images render correctly on the frontend:

1. **Create Bucket**: Enable "Block Public Access" (Off) if you want direct URL access, or configure a Bucket Policy.
2. **Bucket Policy**:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicRead",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
       }
     ]
   }
   ```
3. **IAM User**: Create a user with `AmazonS3FullAccess` (or specific `PutObject` permissions) and generate the Access/Secret keys.

---

## 4. Operational Workflow

### Project Management
- **Flagship Builds**: Appear in "Selected Works".
- **S3 Assets**: Images uploaded via the CMS are stored in `s3://bucket/projects/`.

### The Journal (Blog)
- **Slug Generation**: Slugs are automatically generated from titles.
- **S3 Assets**: Header images are stored in `s3://bucket/blog/`.

### Global Settings
- **Resume Management**: Uploaded PDFs are stored in `s3://bucket/resumes/`.

---

## 5. Deployment (Vercel)

When deploying, ensure all AWS and Firebase variables are added to the **Project Settings -> Environment Variables** section. The application uses Next.js Server Actions for S3 uploads, which automatically securely scales within the Vercel environment.
