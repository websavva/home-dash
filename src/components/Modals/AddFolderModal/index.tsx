import { useState } from 'react';

import type { ModalProps } from '@/context/modals/types';
import Input from '@/components/UI/Input';
import Button from '@/components/UI/Button';

import Modal from '../Modal';

import classes from './index.module.scss';

export interface AddFolderModalForm {
  title: string;
}

function AddFolderModal({ submit, close }: ModalProps<AddFolderModalForm>) {
  const [title, setTitle] = useState('');

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
        />

        <Button type="submit" className={classes['add-folder-modal__btn']}>
          Create
        </Button>
      </form>
    </Modal>
  );
}

export default AddFolderModal;
