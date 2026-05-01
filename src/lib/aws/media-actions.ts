
'use server';

/**
 * @fileOverview Server actions for the admin Media Library.
 * Provides listing and deletion of S3 objects.
 * All actions run server-side only — no AWS credentials leak to the client.
 */

import {
  ListObjectsV2Command,
  DeleteObjectCommand,
  type _Object,
} from "@aws-sdk/client-s3";
import { s3Client } from "./s3-client";
import type { MediaItem, ListMediaResult } from "./media-types";

const BUCKET = process.env.AWS_S3_BUCKET_NAME!;
const CDN_BASE = process.env.NEXT_PUBLIC_CDN_URL || 'https://assets.kartikjindal.site';

/**
 * Lists images stored in S3, optionally filtered by prefix (folder).
 * Uses ContinuationToken for pagination so we never load the full bucket.
 */
export async function listMedia(
  prefix?: string,
  continuationToken?: string,
  maxKeys: number = 50,
): Promise<ListMediaResult> {
  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: prefix || undefined,
      ContinuationToken: continuationToken || undefined,
      MaxKeys: maxKeys,
    });

    const response = await s3Client.send(command);

    const items: MediaItem[] = (response.Contents || [])
      .filter((obj: _Object) => {
        // Skip "folder" placeholders and non-image files
        const key = obj.Key || '';
        if (key.endsWith('/')) return false;
        // Accept common image formats + PDFs (resumes)
        return /\.(jpe?g|png|gif|webp|svg|avif|pdf)$/i.test(key);
      })
      .map((obj: _Object) => ({
        key: obj.Key!,
        url: `${CDN_BASE}/${obj.Key}`,
        size: obj.Size || 0,
        lastModified: obj.LastModified?.toISOString() || '',
        folder: obj.Key!.split('/')[0] || 'general',
      }));

    return {
      items,
      nextToken: response.NextContinuationToken,
      totalShown: items.length,
    };
  } catch (error: any) {
    console.error("S3 List Error:", error);
    return { items: [], totalShown: 0 };
  }
}

/**
 * Deletes a single object from S3 by its key.
 * WARNING: This is irreversible and will break any Firestore documents
 * that reference this asset's CDN URL.
 */
export async function deleteMedia(key: string): Promise<{ success: boolean; error?: string }> {
  if (!key) return { success: false, error: 'No key provided.' };

  try {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: BUCKET,
        Key: key,
      }),
    );
    return { success: true };
  } catch (error: any) {
    console.error("S3 Delete Error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Extracts the S3 key from a CDN or S3 URL.
 * Useful for converting stored URLs back to actionable S3 keys.
 */
export async function extractKeyFromUrl(url: string): Promise<string | null> {
  if (!url) return null;

  // CDN URL: https://assets.kartikjindal.site/projects/123-img.jpg
  if (url.startsWith(CDN_BASE)) {
    return url.replace(`${CDN_BASE}/`, '');
  }

  // Direct S3 URL: https://bucket.s3.region.amazonaws.com/key
  const s3Match = url.match(/amazonaws\.com\/(.+)$/);
  if (s3Match) return s3Match[1];

  // Relative path: /projects/123-img.jpg
  if (url.startsWith('/')) return url.slice(1);

  return null;
}
