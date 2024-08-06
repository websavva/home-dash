import { describe, beforeEach, afterEach, it, expect } from 'vitest';

import { getScrollingParent } from './get-scrolling-parent';

describe('getScrollingParent', () => {
  let container: HTMLDivElement | null;

  beforeEach(() => {
    // Create a DOM container to hold our elements
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    // Clean up after each test
    document.body.removeChild(container!);
    container = null;
  });

  it('should return null if no scrolling parent is found', () => {
    const el = document.createElement('div');
    container!.appendChild(el);

    const result = getScrollingParent(el);
    expect(result).toBeNull();
  });

  it('should return the direct scrolling parent', () => {
    const parentEl = document.createElement('div');
    parentEl.style.overflow = 'auto';
    const childEl = document.createElement('div');
    parentEl.appendChild(childEl);
    container!.appendChild(parentEl);

    const result = getScrollingParent(childEl);
    expect(result).toBe(parentEl);
  });

  it('should return the nearest scrolling parent', () => {
    const grandParentEl = document.createElement('div');
    const parentEl = document.createElement('div');
    parentEl.style.overflow = 'scroll';
    const childEl = document.createElement('div');
    parentEl.appendChild(childEl);
    grandParentEl.appendChild(parentEl);
    container!.appendChild(grandParentEl);

    const result = getScrollingParent(childEl);
    expect(result).toBe(parentEl);
  });

  it('should ignore non-scrolling parents and find the correct one', () => {
    const grandParentEl = document.createElement('div');
    const parentEl = document.createElement('div');
    const childEl = document.createElement('div');
    parentEl.style.overflow = 'hidden';
    grandParentEl.style.overflow = 'auto';
    parentEl.appendChild(childEl);
    grandParentEl.appendChild(parentEl);
    container!.appendChild(grandParentEl);

    const result = getScrollingParent(childEl);
    expect(result).toBe(grandParentEl);
  });
});
