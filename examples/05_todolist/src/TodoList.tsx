// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import React, { useState, useTransition } from 'react';

import { prefetch } from 'react-suspense-fetch';

import { fetchTodos, TodoType } from './fetchFuncs';
import NewItem from './NewItem';

const initialItems = prefetch(fetchTodos, null);

const TodoList: React.FC = () => {
  const [startTransition, isPending] = useTransition({
    timeoutMs: 2000,
  });
  const [items, setItems] = useState<TodoType[]>(initialItems);
  const onClick = () => {
    startTransition(() => {
      setItems(prefetch(fetchTodos, null));
    });
  };
  return (
    <div>
      <button type="button" onClick={onClick}>Refetch</button>
      {isPending && 'Pending...'}
      <ul>
        {items.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
        <li><NewItem setItems={setItems} /></li>
      </ul>
    </div>
  );
};

export default TodoList;
