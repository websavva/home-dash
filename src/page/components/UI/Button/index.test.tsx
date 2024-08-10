import { expect, describe, vi, it } from 'vitest';
import { render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import Button from './index';

const mockedClasses = vi.hoisted(() => ({
  button: 'inner-class',
}));

vi.mock('./index.module.scss', () => ({
  default: mockedClasses,
}));

const setup = (props: Parameters<typeof Button>[0]) => {
  const utils = render(<Button {...props} />);

  const button = utils.container.querySelector('button')!;

  return {
    button,
    ...utils,
  };
};

describe('Input', async () => {
  it('should have outer and inner classes', () => {
    const { button } = setup({
      className: 'outer-class',
    });

    expect(button).toBeInstanceOf(HTMLButtonElement);
    expect(button).toHaveClass('outer-class');
    expect(button).toHaveClass('inner-class');
  });

  it('should attach attributes', () => {
    const { button } = setup({
      type: 'submit',
      disabled: true,
      children: 'Submit',
    });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveTextContent('Submit');
  });

  it('should be interactive', async () => {
    const onClick = vi.fn((e) => {
      return e.target;
    });

    const user = userEvent.setup();

    const { button } = setup({
      onClick,
    });

    await user.click(button);

    expect(onClick).toHaveBeenCalledOnce();
    expect(onClick).toReturnWith(button);
  });
});
