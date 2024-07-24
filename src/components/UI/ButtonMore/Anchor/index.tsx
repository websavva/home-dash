import {
  type HTMLAttributes,
  createContext,
  useState,
  useCallback,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { clsx } from 'clsx';

import classes from './index.module.scss';

export type ButtonMoreAnchorProps = HTMLAttributes<HTMLDivElement>;

interface ButtonMoreContext {
  isOpened: boolean;
  setIsOpened: Dispatch<SetStateAction<boolean>>;
  onToggle: () => void;
  onClose: () => void;
  onOpen: () => void;
  buttonClassName: string;
}

export const ButtonMoreContext = createContext<ButtonMoreContext>({
  isOpened: false,
  setIsOpened: () => {},
  onToggle: () => {},
  onClose: () => {},
  onOpen: () => {},
  buttonClassName: '',
});

function ButtonMoreAnchor(props: ButtonMoreAnchorProps) {
  const [isOpened, setIsOpened] = useState(false);

  const onToggle = useCallback(() => {
    setIsOpened((isPrevOpened) => !isPrevOpened);
  }, [setIsOpened]);

  const onClose = useCallback(() => {
    setIsOpened(false);
  }, [setIsOpened]);

  const onOpen = useCallback(() => {
    setIsOpened(true);
  }, [setIsOpened]);

  return (
    <ButtonMoreContext.Provider
      value={{
        isOpened,
        setIsOpened,
        onClose,
        onOpen,
        onToggle,
        buttonClassName: classes['button-more-anchor__btn'],
      }}
    >
      <div
        {...props}
        onMouseLeave={() => onClose()}
        className={clsx(classes['button-more-anchor'], props.className)}
      />
    </ButtonMoreContext.Provider>
  );
}

export default ButtonMoreAnchor;
