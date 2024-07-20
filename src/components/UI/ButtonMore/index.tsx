import {
  useState,
  useCallback,
  type HTMLAttributes,
  type FunctionComponent,
} from 'react';
import { EllipsisVerticalIcon } from 'lucide-react';
import { clsx } from 'clsx';

import { useClickAway } from '@/hooks/use-click-away';

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
  const [isOpened, setIsOpened] = useState(false);

  const onClickAway = useCallback(() => {
    setIsOpened(false);
  }, [setIsOpened]);

  const rootElementRef = useClickAway<HTMLDivElement>(onClickAway);

  const onToggle = () => {
    setIsOpened((isPrevOpened) => !isPrevOpened);
  };

  return (
    <div
      {...attrs}
      ref={rootElementRef}
      className={clsx(classes['button-more'], className)}
    >
      <button 
        className={classes['button-more__activator']}
        onClick={onToggle}
      >
        <EllipsisVerticalIcon />
      </button>

      {isOpened && (
        <div
          className={classes['button-more__actions']}
          data-button-more-actions
        >
          {actions.map(({ id, onClick, label, Icon }) => {
            return (
              <div
                key={id}
                className={classes['button-more__actions__item']}
                onClick={() => {
                  onClick();
                  setIsOpened(false);
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
