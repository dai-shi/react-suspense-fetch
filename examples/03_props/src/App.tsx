import React, { Suspense } from 'react';

import { prepare } from 'react-suspense-fetch';

import Item from './Item';

export const fetchFunc = async (userId: string) => (await fetch(`https://reqres.in/api/users/${userId}?delay=3`)).json();

const items = [
  { initialId: '1', initialResult: prepare(fetchFunc) },
  { initialId: '2', initialResult: prepare(fetchFunc) },
  { initialId: '3', initialResult: prepare(fetchFunc) },
];

const App: React.FC = () => (
  <Suspense fallback={<span>Loading...</span>}>
    {items.map(({ initialId, initialResult }) => (
      <div key={initialId}>
        <Item initialId={initialId} initialResult={initialResult} />
        <hr />
      </div>
    ))}
  </Suspense>
);

export default App;
