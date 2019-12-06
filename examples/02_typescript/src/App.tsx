import React, { Suspense } from 'react';

import { prefetch } from 'react-suspense-fetch';

import Item from './Item';

export const fetchFunc = async (userId: string) => (await fetch(`https://reqres.in/api/users/${userId}?delay=3`)).json();

const items = [
  { id: '1', initialResult: prefetch(fetchFunc, '1') },
  { id: '2', initialResult: prefetch(fetchFunc, '2') },
  { id: '3', initialResult: prefetch(fetchFunc, '3') },
];

const App: React.FC = () => (
  <Suspense fallback={<span>Loading...</span>}>
    {items.map(({ id, initialResult }) => (
      <div key={id}>
        <Item initialId={id} initialResult={initialResult} />
        <hr />
      </div>
    ))}
  </Suspense>
);

export default App;
