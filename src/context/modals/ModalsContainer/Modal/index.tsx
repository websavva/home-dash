import type { PropsWithChildren } from 'react';

import classes from './index.module.scss';

function Modal({
  onClose,
  children,
}: PropsWithChildren<{ onClose: () => any }>) {
  return (
    <div className={classes['modal']}>
      <div className={classes['modal__overlay']} onClick={onClose} />

      <div className={classes['modal__window']}>{children}</div>
    </div>
  );
}

export default Modal;
