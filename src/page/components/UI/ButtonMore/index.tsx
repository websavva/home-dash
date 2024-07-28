import {
  type HTMLAttributes,
  type FunctionComponent,
  useCallback,
  useContext,
} from 'react';
import { EllipsisVerticalIcon } from 'lucide-react';
import { clsx } from 'clsx';

import { useClickAway } from '#page/hooks/use-click-away';

import { ButtonMoreContext } from './Anchor';
import classes from './index.module.scss';

export interface ButtonMoreAction {
  id: string | number;
  Icon: FunctionComponent;
  label: string;
  onClick: () => any;
}

export interface ButtonMoreProps extends HTMLAttributes<HTMLDivElement> {
  actions: ButtonMoreAction[];
}

function ButtonMore({ actions, className, ...attrs }: ButtonMoreProps) {
  const { isOpened, onToggle, onClose, buttonClassName } =
    useContext(ButtonMoreContext);

  const onClickAway = useCallback(() => {
    onClose();
  }, [onClose]);

  const rootElementRef = useClickAway<HTMLDivElement>(onClickAway);

  return (
    <div
      {...attrs}
      ref={rootElementRef}
      className={clsx(classes['button-more'], buttonClassName, className)}
      data-button-more={isOpened ? 'opened' : 'closed'}
    >
      <button className={classes['button-more__activator']} onClick={onToggle}>
        <EllipsisVerticalIcon />
      </button>

      {isOpened && (
        <div className={classes['button-more__actions']}>
          {actions.map(({ id, onClick, label, Icon }) => {
            return (
              <div
                key={id}
                className={classes['button-more__actions__item']}
                onClick={() => {
                  onClick();
                  onClose();
                }}
              >
                <Icon />

                <span>{label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ButtonMore;
