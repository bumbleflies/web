import { describe, it, expect, beforeEach } from 'vitest';

describe('ThemeToggle Logic', () => {
  beforeEach(() => {
    // Use the real happy-dom localStorage; just ensure isolation between tests.
    // NOTE: Do not assign to `global.localStorage` — under Vitest 5 the global
    // is a getter-only property on GlobalWindow and assignment throws
    // "Cannot set property localStorage ... which has only a getter".
    localStorage.clear();

    document.documentElement.removeAttribute('data-theme');
  });

  it('should toggle theme from light to dark', () => {
    const element = document.documentElement;
    
    // Simulate initial state (light)
    expect(element.getAttribute('data-theme')).toBeNull();

    // Toggle logic (simplified version of the script in component)
    const isDark = element.getAttribute('data-theme') === 'dark';
    if (isDark) {
      element.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    } else {
      element.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }

    expect(element.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('should toggle theme from dark to light', () => {
    const element = document.documentElement;
    element.setAttribute('data-theme', 'dark');
    
    // Toggle logic
    const isDark = element.getAttribute('data-theme') === 'dark';
    if (isDark) {
      element.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    } else {
      element.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }

    expect(element.getAttribute('data-theme')).toBeNull();
    expect(localStorage.getItem('theme')).toBe('light');
  });
});
