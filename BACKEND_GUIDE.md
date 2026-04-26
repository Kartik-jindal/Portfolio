
# Architectural Management System: Backend Guide

This document provides a technical overview and setup guide for the Hybrid Infrastructure (Firebase + AWS) integrated into your cinematic portfolio.

## 1. Core Services

We utilize a multi-cloud strategy to power the portfolio's dynamic capabilities:
- **Firebase Authentication**: Secure access to the Admin Dashboard via Google Sign-In and Email/Password.
- **Cloud Firestore**: A NoSQL database storing your projects, journal entries, career timeline, and site settings.
- **AWS S3**: High-performance storage for project imagery, blog assets, and your resume PDF.

---

## 2. Environment Variables (.env.local)

The following variables are configured for the Command Center to operate.

### Firebase Credentials
| Key | Purpose |
|-----|---------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Public Firebase API access |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Auth redirect domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firestore/Auth Project ID |

### AWS S3 Credentials (Server-Side)
| Key | Value |
|-----|-------|
| `AWS_REGION` | `eu-north-1` |
| `AWS_ACCESS_KEY_ID` | `AKIA4U3OTE...` |
| `AWS_SECRET_ACCESS_KEY` | `JHJljitkiz...` |
| `AWS_S3_BUCKET_NAME` | `kj-portfolio-bucket` |

---

## 3. AWS S3 Setup Guide

To ensure your images render correctly on the frontend:

1. **Create Bucket**: Ensure the bucket `kj-portfolio-bucket` is created in the `eu-north-1` region.
2. **Public Access**: For portfolio use, ensure "Block Public Access" is tuned to allow your bucket policy to function.
3. **Bucket Policy**:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicRead",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::kj-portfolio-bucket/*"
       }
     ]
   }
   ```
4. **IAM User**: Ensure the user associated with the provided Access Key has `AmazonS3FullAccess` or specific `s3:PutObject` and `s3:PutObjectAcl` permissions for the bucket.

---

## 4. Operational Workflow

### Project Management
- **Flagship Builds**: Appear in "Selected Works".
- **S3 Assets**: Images uploaded via the CMS are stored in `s3://kj-portfolio-bucket/projects/`.

### The Journal (Blog)
- **Slug Generation**: Slugs are automatically generated from titles.
- **S3 Assets**: Header images are stored in `s3://kj-portfolio-bucket/blog/`.

### Global Settings
- **Resume Management**: Uploaded PDFs are stored in `s3://kj-portfolio-bucket/resumes/`.

---

## 5. Deployment (Vercel)

When deploying, ensure all AWS and Firebase variables are added to the **Project Settings -> Environment Variables** section. The application uses Next.js Server Actions for S3 uploads, which automatically securely scales within the Vercel environment.
