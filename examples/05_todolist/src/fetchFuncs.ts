import { createFetchStore } from 'react-suspense-fetch';

export type TodoType = {
  id: number;
  name: string;
};

const isTodoType = (x: unknown): x is TodoType => (
  typeof x === 'object'
  && typeof (x as TodoType).id === 'number'
  && typeof (x as TodoType).name === 'string'
);

const fetchTodos = async () => {
  const res = await fetch('https://reqres.in/api/todos?delay=1');
  const { data } = await res.json();
  return data.filter(isTodoType) as TodoType[];
};

export const fetchTodosStore = createFetchStore(fetchTodos);

const createTodo = async (name: string) => {
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

export const createTodoStore = createFetchStore(createTodo);
