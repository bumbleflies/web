/**
 * SERP title helper.
 *
 * Google truncates a <title> at roughly 580 px (~60 characters) on desktop.
 * Appending " | bumbleflies" to an already long editorial title pushes the
 * distinguishing part of the title out of the snippet, so the suffix is only
 * added when the result still fits.
 */
export const TITLE_LIMIT = 60;
const BRAND = 'bumbleflies';

export function formatPageTitle(title: string, limit = TITLE_LIMIT): string {
  const base = title.trim();
  const withBrand = `${base} | ${BRAND}`;
  if (withBrand.length <= limit) return withBrand;
  return base;
}

/** True when a title would be truncated in a SERP. Used by the tests. */
export function isTitleTooLong(title: string, limit = TITLE_LIMIT): boolean {
  return title.length > limit;
}
