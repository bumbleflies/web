import { describe, it, expect } from 'vitest';
import { supportsContentMappers } from '../lib/toolchain.mjs';

// `npm run typecheck` passes --runExternalCode, which only exists from
// TypeScript 7.1 on. The guard turns a stale node_modules into a readable
// error instead of "error TS5023: Unknown compiler option".
describe('type-check toolchain guard', () => {
  it('accepts TypeScript 7.1 and newer', () => {
    expect(supportsContentMappers('7.1.0-beta')).toBe(true);
    expect(supportsContentMappers('7.1.0')).toBe(true);
    expect(supportsContentMappers('7.1.0-dev.20261030.1')).toBe(true);
    expect(supportsContentMappers('7.2.3')).toBe(true);
    expect(supportsContentMappers('8.0.0')).toBe(true);
  });

  it('rejects the stable line that lacks content mappers', () => {
    expect(supportsContentMappers('7.0.2')).toBe(false);
    expect(supportsContentMappers('6.0.0')).toBe(false);
    expect(supportsContentMappers('5.9.3')).toBe(false);
  });

  it('rejects garbage instead of guessing', () => {
    expect(supportsContentMappers('')).toBe(false);
    expect(supportsContentMappers('latest')).toBe(false);
    expect(supportsContentMappers(undefined)).toBe(false);
  });
});
