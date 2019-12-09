import React, { Suspense } from 'react';

import { prepare } from 'react-suspense-fetch';

import Item from './Item';

export const fetchFunc = async (userId: string) => (await fetch(`https://reqres.in/api/users/${userId}?delay=3`)).json();

const items = [
  { key: 'a', initialResult: prepare(fetchFunc) },
  { key: 'b', initialResult: prepare(fetchFunc) },
  { key: 'c', initialResult: prepare(fetchFunc) },
];

const App: React.FC = () => (
  <Suspense fallback={<span>Loading...</span>}>
    {items.map(({ key, initialResult }) => (
      <div key={key}>
        <Item initialResult={initialResult} />
        <hr />
      </div>
    ))}
  </Suspense>
);

export default App;
