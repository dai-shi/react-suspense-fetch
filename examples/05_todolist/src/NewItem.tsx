import React, {
  useState,
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  useTransition,
  Dispatch,
  SetStateAction,
} from 'react';

import { prefetch } from 'react-suspense-fetch';

import { createTodo, TodoType } from './fetchFuncs';

type Props = {
  setItems: Dispatch<SetStateAction<TodoType[]>>;
};

const NewItem: React.FC<Props> = ({ setItems }) => {
  const [startTransition, isPending] = useTransition({
    timeoutMs: 2000,
  });
  const [name, setName] = useState('');
  const onClick = () => {
    if (!name) return;
    startTransition(() => {
      setItems((prev) => [...prev, prefetch(createTodo, name)]);
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
