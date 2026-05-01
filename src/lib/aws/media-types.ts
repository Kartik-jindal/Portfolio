/**
 * @fileOverview Shared types and constants for the Media Library.
 * Separated from media-actions.ts because 'use server' files
 * can only export async functions in Next.js 15.
 */

/** Folders the UI will expose for filtering. */
export const MEDIA_FOLDERS = ['projects', 'blog', 'resumes', 'general'] as const;
export type MediaFolder = (typeof MEDIA_FOLDERS)[number];

export interface MediaItem {
  key: string;
  url: string;          // CDN URL
  size: number;         // bytes
  lastModified: string; // ISO string
  folder: string;
}

export interface ListMediaResult {
  items: MediaItem[];
  nextToken?: string;
  totalShown: number;
}
