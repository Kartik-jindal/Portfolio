/**
 * Computes an estimated reading time string from HTML or plain text content.
 * Strips HTML tags, counts words, and assumes 200 words per minute.
 */
export function computeReadTime(content: string): string {
    if (!content) return '1 min read';
    // Strip HTML tags
    const text = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const wordCount = text.split(' ').filter(Boolean).length;
    const minutes = Math.max(1, Math.round(wordCount / 200));
    return `${minutes} min read`;
}
