
/**
 * @fileOverview Utility functions for CDN asset management and URL normalization.
 */

const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL || 'https://assets.kartikjindal.site';
const S3_HOSTNAME = 'kj-portfolio-bucket.s3.eu-north-1.amazonaws.com';

/**
 * Normalizes an asset URL to use the CDN domain if it's an S3 link.
 * Maintains backward compatibility with existing S3 URLs stored in the database.
 * 
 * @param url - The source URL or path to normalize.
 * @param fallback - Optional fallback image if the URL is missing.
 * @returns The normalized CDN URL.
 */
export function getAssetUrl(url?: string, fallback: string = 'https://picsum.photos/seed/placeholder/1600/1000'): string {
  if (!url) return fallback;

  // 1. If it's already using the CDN domain, return it as is
  if (url.includes(CDN_URL)) {
    return url;
  }

  // 2. If it's a direct S3 URL, replace the S3 hostname with the CDN domain
  // We use a regex to handle both http, https, and protocol-relative URLs
  const s3Regex = new RegExp(`^(https?:)?//${S3_HOSTNAME.replace(/\./g, '\\.')}`, 'i');
  if (s3Regex.test(url)) {
    return url.replace(s3Regex, CDN_URL);
  }

  // 3. If it's a relative path (e.g. /projects/img.jpg), prepend the CDN URL
  if (url.startsWith('/')) {
    // Only prepend if it doesn't look like a local /_next or /public asset
    // Most user-uploaded assets in this project are stored with full URLs in Firestore,
    // but we handle paths for robustness.
    if (!url.startsWith('/_next') && !url.startsWith('/api') && !url.startsWith('/admin')) {
      return `${CDN_URL}${url}`;
    }
  }

  // 4. Return as is (could be a placeholder or another external source like Google/GitHub)
  return url;
}
