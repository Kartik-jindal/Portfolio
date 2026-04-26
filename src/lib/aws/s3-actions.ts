
'use server';

/**
 * @fileOverview AWS S3 Server Actions for file management.
 * Handles secure server-side uploads to bypass client-side credential exposure.
 */

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

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
    });

    await s3Client.send(command);

    // Construct the public URL
    // Note: Ensure your bucket is configured for public read or use a CloudFront distribution
    const url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    
    return { success: true, url };
  } catch (error: any) {
    console.error("S3 Upload Error:", error);
    return { success: false, error: error.message };
  }
}
