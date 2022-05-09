import React, { Suspense, useState, useTransition } from 'react';
import { createRoot } from 'react-dom/client';

import { createFetchStore } from 'react-suspense-fetch';

const DisplayData = ({ result, update }) => {
  const [isPending, startTransition] = useTransition();
  const onClick = () => {
    startTransition(() => {
      update('2');
    });
  };
  return (
    <div>
      <div>First Name: {result.data.first_name}</div>
      <button type="button" onClick={onClick}>Refetch user 2</button>
      {isPending && 'Pending...'}
    </div>
  );
};

const fetchFunc = async (userId) => (await fetch(`https://reqres.in/api/users/${userId}?delay=3`)).json();
const store = createFetchStore(fetchFunc);
store.prefetch('1');

const Main = () => {
  const [id, setId] = useState('1');
  const result = store.get(id);
  const update = (nextId) => {
    store.prefetch(nextId);
    setId(nextId);
  };
  return <DisplayData result={result} update={update} />;
};

const App = () => (
  <Suspense fallback={<span>Loading...</span>}>
    <Main />
  </Suspense>
);

createRoot(document.getElementById('app')).render(<App />);
