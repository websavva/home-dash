import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';

import Input from './index';

test('Link changes the state when hovered', async () => {
  render(<Input disabled id="test-input" />);

  const inputElement = screen.getByText((_, element) => {
    if (!element) return false;

    return element.matches('input[id="test-input"][disabled]');
  });

  expect(inputElement).toBeInstanceOf(HTMLInputElement);
});
