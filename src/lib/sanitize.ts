import sanitizeHtml from 'sanitize-html';

// ── Shared sanitizer config ──────────────────────────────────────────────────
// Used by Server Components and server actions to clean admin-authored HTML
// before rendering or storing. Keeps a minimal, security-first allowlist.

const ALLOWED_TAGS = [
  // Inline text
  'p', 'br', 'strong', 'em', 'u', 's', 'b', 'i', 'span',
  // Headings
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  // Lists
  'ul', 'ol', 'li',
  // Block
  'blockquote', 'pre', 'code', 'hr', 'div',
  // Links & media
  'a', 'img', 'figure', 'figcaption',
  // Tables
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
];

/**
 * Per-tag attribute allowlists.
 *
 * Design decisions:
 * - `id` is omitted globally — IDs can be exploited for DOM clobbering attacks
 *   and are unnecessary for rendered blog/project content.
 * - `class` is allowed on all tags so Tailwind/prose styling is preserved.
 * - Links get `href`, `target`, `rel`, `title` only.
 * - Images get dimensional + descriptive attrs; `src` is scheme-filtered below.
 */
const ALLOWED_ATTRIBUTES: sanitizeHtml.IOptions['allowedAttributes'] = {
  a: ['href', 'target', 'rel', 'title'],
  img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
  '*': ['class'],
};

/** Only allow safe URL schemes for href and src. */
const ALLOWED_SCHEMES: sanitizeHtml.IOptions['allowedSchemes'] = [
  'http',
  'https',
  'mailto',
];

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ALLOWED_TAGS,
  allowedAttributes: ALLOWED_ATTRIBUTES,
  allowedSchemes: ALLOWED_SCHEMES,

  // ── Link hardening ────────────────────────────────────────────────────────
  // Force rel="noopener noreferrer" on every <a> to prevent tab-napping and
  // referrer leakage. This fires even if the author already set a `rel` value
  // — we merge rather than overwrite.
  transformTags: {
    a: (tagName, attribs) => {
      const existing = (attribs.rel || '').split(/\s+/).filter(Boolean);
      const required = ['noopener', 'noreferrer'];
      const merged = [...new Set([...existing, ...required])].join(' ');

      return {
        tagName,
        attribs: {
          ...attribs,
          rel: merged,
          // Default external links to _blank if the author didn't specify
          ...(attribs.target ? {} : { target: '_blank' }),
        },
      };
    },
  },

  // Strip any tags not in the allowlist rather than escaping them, so the
  // rendered output stays clean.
  disallowedTagsMode: 'discard',
};

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Sanitize admin-authored HTML for safe rendering via `dangerouslySetInnerHTML`.
 *
 * Handles edge cases:
 * - Empty/null/undefined input → returns `''`
 * - Plain text (no HTML tags) → wrapped in `<p>` after escaping
 * - Rich HTML → sanitized with the shared allowlist
 */
export function sanitize(html: string | null | undefined): string {
  if (!html) return '';

  const trimmed = html.trim();
  if (!trimmed) return '';

  // Plain text with no HTML tags — escape it and wrap in a paragraph
  if (!/\<[a-z][\s\S]*\>/i.test(trimmed)) {
    const escaped = sanitizeHtml(trimmed, {
      allowedTags: [],
      allowedAttributes: {},
    });
    return `<p>${escaped}</p>`;
  }

  return sanitizeHtml(trimmed, SANITIZE_OPTIONS);
}

/**
 * Pre-storage sanitizer — call this in server actions before writing HTML to
 * Firestore. Identical rules to the render-time sanitizer so the output is
 * consistent. This is a defense-in-depth measure: even if the render-time
 * sanitizer is bypassed or the data is read by a different client, the stored
 * HTML is already clean.
 *
 * Usage (in a server action):
 * ```ts
 * const clean = sanitizeForStorage(rawHtml);
 * await setDoc(ref, { content: clean });
 * ```
 */
export const sanitizeForStorage = sanitize;
