import type { JSX } from 'react';
import { clsx } from 'clsx';

import classes from './index.module.scss';

function Button(props: JSX.IntrinsicElements['button']) {
  return (
    <button {...props} className={clsx(classes['button'], props.className)} />
  );
}

export default Button;
