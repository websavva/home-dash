import { useState } from 'react';

import type { ModalProps } from '@/context/modals/types';
import Input from '@/components/UI/Input';
import Button from '@/components/UI/Button';
import { useInputControl } from '@/hooks/use-input-control';

import Modal from '../Modal';

import classes from './index.module.scss';

export type BookmarkModalForm = {
  title: string;
  url: string;
};

export interface BookmarkModalExtraProps {
  initialForm?: BookmarkModalForm;
  buttonLabel?: string;
}

function BookmarkModal({
  submit,
  close,
  initialForm,
  buttonLabel = 'Create',
}: ModalProps<BookmarkModalForm, BookmarkModalExtraProps>) {
  const [form, setForm] = useState<BookmarkModalForm>(
    initialForm || {
      title: '',
      url: '',
    },
  );

  const inputControl = useInputControl(form, setForm);

  return (
    <Modal onClose={close} title="Add New Card">
      <form
        className={classes['bookmark-modal']}
        onSubmit={(e) => {
          e.preventDefault();

          submit(form);
        }}
      >
        <Input
          {...inputControl('title')}
          placeholder="Enter title..."
          type="text"
          required
        />

        <Input
          {...inputControl('url')}
          placeholder="Enter URL..."
          type="url"
          required
        />

        <Button type="submit" className={classes['bookmark-modal__btn']}>
          {buttonLabel}
        </Button>
      </form>
    </Modal>
  );
}

export default BookmarkModal;