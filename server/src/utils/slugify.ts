/**
 * Converts a string to a URL-safe slug.
 *
 * "Hiking Boots" → "hiking-boots"
 * "Hats & Gloves" → "hats-gloves"
 * "Multi-Day Packs" → "multi-day-packs"
 *
 * Why not use a library like `slugify` from npm?
 * You could — and in production you would. But for learning,
 * seeing what a slug function actually does is valuable.
 * The logic is simple: lowercase, replace non-alphanumeric
 * characters with hyphens, collapse multiple hyphens, trim edges.
 */
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')  // non-alphanumeric → hyphen
    .replace(/^-+|-+$/g, '');      // trim leading/trailing hyphens
};