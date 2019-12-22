import React, { Suspense } from 'react';

import { prefetch } from 'react-suspense-fetch';

import Item from './Item';
import { fetchUser } from './fetchFuncs';

const items = [
  { id: '1', initialResult: prefetch(fetchUser, '1') },
  { id: '2', initialResult: prefetch(fetchUser, '2') },
  { id: '3', initialResult: prefetch(fetchUser, '3') },
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
