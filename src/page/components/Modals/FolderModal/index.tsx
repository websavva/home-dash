import { useState } from 'react';

import type { ModalProps } from '#page/context/modals/types';
import Input from '#page/components/UI/Input';
import Button from '#page/components/UI/Button';

import { useInputControl } from '#page/hooks/use-input-control';

import Modal from '../Modal';

import classes from './index.module.scss';

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
        data-testid="form"
      >
        <Input
          {...inputControl('title')}
          placeholder="Enter title..."
          type="text"
          required
          minLength={1}
          data-testid="input"
        />

        <Button
          type="submit"
          className={classes['folder-modal__btn']}
          data-testid="button"
        >
          {buttonLabel}
        </Button>
      </form>
    </Modal>
  );
}

export default FolderModal;
