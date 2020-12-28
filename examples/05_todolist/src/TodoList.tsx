// eslint-disable-next-line spaced-comment
/// <reference types="react/experimental" />

import React, { useState, unstable_useTransition as useTransition } from 'react';

import { fetchTodosStore, TodoType } from './fetchFuncs';
import NewItem from './NewItem';

fetchTodosStore.prefetch(null);

const TodoList: React.FC = () => {
  const [startTransition, isPending] = useTransition();
  const [items, setItems] = useState<TodoType[]>(fetchTodosStore.get(null));
  const onClick = () => {
    startTransition(() => {
      setItems(() => fetchTodosStore.get(null));
    });
  };
  return (
    <div>
      <button type="button" onClick={onClick}>Refresh</button>
      {isPending && 'Pending...'}
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
        <li><NewItem setItems={setItems} /></li>
      </ul>
    </div>
  );
};

export default TodoList;
