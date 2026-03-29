/**
 * Takes a Cloudinary URL and returns a web-optimised version for display.
 * Original is untouched — used for download.
 *
 * Targets ~700 KB:
 *   q_auto:good  — smart quality (≈75-80)
 *   f_auto       — WebP/AVIF when browser supports it
 *   w_2000       — cap width at 2000px (retina-ready, portfolio-safe)
 */
export function getDisplayUrl(url: string): string {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  return url.replace(
    "/image/upload/",
    "/image/upload/q_auto:good,f_auto,w_2000/"
  );
}

/**
 * Returns original Cloudinary URL for download (full quality).
 */
export function getOriginalUrl(url: string): string {
  return url;
}
