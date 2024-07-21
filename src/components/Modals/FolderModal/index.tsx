import { useState } from 'react';

import type { ModalProps } from '@/context/modals/types';
import Input from '@/components/UI/Input';
import Button from '@/components/UI/Button';

import Modal from '../Modal';

import classes from './index.module.scss';

export interface FolderModalForm {
  title: string;
}

export interface FolderModalExtraProps {
  initialTitle?: string;
  buttonLabel?: string;
}

function AddFolderModal({
  submit,
  close,
  initialTitle = '',
  buttonLabel = 'Create',
}: ModalProps<FolderModalForm, FolderModalExtraProps>) {
  const [title, setTitle] = useState(initialTitle);

  return (
    <Modal onClose={close} title="Add New Card">
      <form
        className={classes['add-folder-modal']}
        onSubmit={(e) => {
          e.preventDefault();

          submit({ title });
        }}
      >
        <Input
          value={title}
          onChange={({ target: { value: newTitle } }) => {
            setTitle(newTitle);
          }}
          placeholder="Enter title..."
          type="text"
          required
          minLength={1}
        />

        <Button type="submit" className={classes['add-folder-modal__btn']}>
          {buttonLabel}
        </Button>
      </form>
    </Modal>
  );
}

export default AddFolderModal;
