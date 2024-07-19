import { useState } from 'react';
import type { ModalProps } from '@/context/modals/types';

import classes from './index.module.scss';

export interface AddFolderModalForm {
  title: string;
}

function AddFolderModal({ submit }: ModalProps<AddFolderModalForm>) {
  const [title, setTitle] = useState('');

  return (
    <form
      className={classes['add-folder-modal']}
      onSubmit={(e) => {
        e.preventDefault();

        submit({ title });
      }}
    >
      <input
        value={title}
        onChange={({ target: { value: newTitle } }) => {
          setTitle(newTitle);
        }}
        placeholder="Enter title..."
      />

      <button type="submit">Submit</button>
    </form>
  );
}

export default AddFolderModal;
