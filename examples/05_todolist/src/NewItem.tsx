// eslint-disable-next-line spaced-comment
/// <reference types="react/experimental" />

import React, {
  useState,
  unstable_useTransition as useTransition,
  Dispatch,
  SetStateAction,
} from 'react';

import { createTodoStore, TodoType } from './fetchFuncs';

type Props = {
  setItems: Dispatch<SetStateAction<TodoType[]>>;
};

const NewItem: React.FC<Props> = ({ setItems }) => {
  const [isPending, startTransition] = useTransition() as any; // FIXME
  const [name, setName] = useState('');
  const onClick = () => {
    if (!name) return;
    startTransition(() => {
      setItems((prev) => [...prev, createTodoStore.get(name)]);
      setName('');
    });
  };
  return (
    <>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button type="button" onClick={onClick} disabled={!name}>Create New Item</button>
      {isPending && 'Pending...'}
    </>
  );
};

export default NewItem;
