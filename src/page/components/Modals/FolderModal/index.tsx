import { useState } from 'react';

import type { ModalProps } from '@/context/modals/types';
import Input from '@/components/UI/Input';
import Button from '@/components/UI/Button';

import Modal from '../Modal';

import classes from './index.module.scss';
import { useInputControl } from '@/hooks/use-input-control';

export type FolderModalForm = {
  title: string;
};

export interface FolderModalExtraProps {
  initialTitle?: string;
  buttonLabel?: string;
}

function FolderModal({
  submit,
  close,
  initialTitle = '',
  buttonLabel = 'Create',
}: ModalProps<FolderModalForm, FolderModalExtraProps>) {
  const [form, setForm] = useState<FolderModalForm>({
    title: initialTitle,
  });

  const inputControl = useInputControl<FolderModalForm>(form, setForm);

  return (
    <Modal onClose={close} title="Add New Card">
      <form
        className={classes['folder-modal']}
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
          minLength={1}
        />

        <Button type="submit" className={classes['folder-modal__btn']}>
          {buttonLabel}
        </Button>
      </form>
    </Modal>
  );
}

export default FolderModal;
