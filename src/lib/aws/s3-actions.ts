
'use server';

/**
 * @fileOverview AWS S3 Server Actions for file management.
 * Handles secure server-side uploads to bypass client-side credential exposure.
 */

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./s3-client";

export async function uploadToS3(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    const path = formData.get('path') as string || 'general';
    
    if (!file) throw new Error("No file payload detected.");

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const key = `${path}/${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      CacheControl: 'public, max-age=31536000, immutable',
    });

    await s3Client.send(command);

    // Construct the CDN URL instead of direct S3 URL
    const cdnBase = process.env.NEXT_PUBLIC_CDN_URL || 'https://assets.kartikjindal.site';
    const url = `${cdnBase}/${key}`;
    
    return { success: true, url };
  } catch (error: any) {
    console.error("S3 Upload Error:", error);
    return { success: false, error: error.message };
  }
}
