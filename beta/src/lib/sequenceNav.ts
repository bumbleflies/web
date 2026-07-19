/** Clamps `index` into the valid range [0, length - 1]; returns 0 for an empty sequence. */
export function clampIndex(index: number, length: number): number {
  if (length <= 0) return 0;
  return Math.min(Math.max(index, 0), length - 1);
}

/** Next slide index, clamped so it never advances past the last slide. */
export function nextIndex(current: number, length: number): number {
  return clampIndex(current + 1, length);
}

/** Previous slide index, clamped so it never goes below the first slide. */
export function prevIndex(current: number, length: number): number {
  return clampIndex(current - 1, length);
}

export type SwipeDirection = 'next' | 'prev' | null;

/** Classifies a horizontal touch delta as a next/prev swipe, or null below the threshold. */
export function resolveSwipe(deltaX: number, threshold = 40): SwipeDirection {
  if (deltaX <= -threshold) return 'next';
  if (deltaX >= threshold) return 'prev';
  return null;
}
