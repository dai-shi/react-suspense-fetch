import React, { Suspense } from 'react';

import { prefetch } from 'react-suspense-fetch';

import TodoList from './TodoList';

export type TodoType = {
  id: number;
  name: string;
};

const isTodoType = (x: unknown): x is TodoType => (
  typeof x === 'object'
  && typeof (x as TodoType).id === 'number'
  && typeof (x as TodoType).name === 'string'
);

export const fetchTodos = async () => {
  const res = await fetch('https://reqres.in/api/todos?delay=1');
  const { data } = await res.json();
  return data.filter(isTodoType) as TodoType[];
};

export const createTodo = async (name: string) => {
  const res = await fetch('https://reqres.in/api/todos?delay=1', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });
  const data = await res.json();
  return data as TodoType;
};

export const initialItems = prefetch(fetchTodos, null);

const App: React.FC = () => (
  <Suspense fallback={<span>Loading...</span>}>
    <TodoList initialItems={initialItems} />
  </Suspense>
);

export default App;
