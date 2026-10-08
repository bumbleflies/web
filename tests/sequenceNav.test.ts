import { describe, it, expect } from 'vitest';
import { clampIndex, nextIndex, prevIndex, resolveSwipe } from '../src/lib/sequenceNav';

describe('sequenceNav', () => {
  it('clamps an index below zero to zero', () => {
    expect(clampIndex(-1, 6)).toBe(0);
  });

  it('clamps an index past the end to the last valid index', () => {
    expect(clampIndex(9, 6)).toBe(5);
  });

  it('returns 0 for a zero-length sequence', () => {
    expect(clampIndex(3, 0)).toBe(0);
  });

  it('nextIndex advances by one', () => {
    expect(nextIndex(2, 6)).toBe(3);
  });

  it('nextIndex does not advance past the last slide', () => {
    expect(nextIndex(5, 6)).toBe(5);
  });

  it('prevIndex goes back by one', () => {
    expect(prevIndex(2, 6)).toBe(1);
  });

  it('prevIndex does not go below the first slide', () => {
    expect(prevIndex(0, 6)).toBe(0);
  });

  it('resolveSwipe detects a left swipe as next', () => {
    expect(resolveSwipe(-50)).toBe('next');
  });

  it('resolveSwipe detects a right swipe as prev', () => {
    expect(resolveSwipe(50)).toBe('prev');
  });

  it('resolveSwipe ignores small movements below the threshold', () => {
    expect(resolveSwipe(10)).toBeNull();
  });
});
