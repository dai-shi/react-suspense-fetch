import React, { Suspense } from 'react';

import { prepare } from 'react-suspense-fetch';

import Item from './Item';

const fetchFunc = async (userId: string) => (await fetch(`https://reqres.in/api/users/${userId}?delay=3`)).json();

const items = [
  { id: '1', result: prepare(fetchFunc) },
  { id: '2', result: prepare(fetchFunc) },
  { id: '3', result: prepare(fetchFunc) },
];

const App: React.FC = () => (
  <Suspense fallback={<span>Loading...</span>}>
    {items.map(({ id, result }) => (
      <div key={id}>
        <Item id={id} result={result} />
        <hr />
      </div>
    ))}
  </Suspense>
);

export default App;
