export const getScrollingParent = (el: Element) => {
  let parentEl = el.parentElement;

  while (parentEl) {
    const { overflow } = getComputedStyle(parentEl);

    if (overflow === 'auto' || overflow === 'scroll') break;

    parentEl = parentEl.parentElement;
  }

  return parentEl;
};
