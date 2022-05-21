import React, {
  useState,
  useTransition,
  Dispatch,
  SetStateAction,
} from 'react';

import { createTodoStore, TodoType } from './fetchFuncs';

type Props = {
  setItems: Dispatch<SetStateAction<TodoType[]>>;
};

const NewItem = ({ setItems }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState('');
  const onClick = () => {
    if (!name) return;
    startTransition(() => {
      createTodoStore.prefetch(name);
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
