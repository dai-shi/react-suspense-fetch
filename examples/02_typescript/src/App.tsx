import React, { Suspense } from 'react';

import Item from './Item';
import { store } from './fetchFuncs';

const items = [
  { id: '1' },
  { id: '2' },
  { id: '3' },
];

store.prefetch('1');
store.prefetch('2');
store.prefetch('3');

const App = () => (
  <Suspense fallback={<span>Loading...</span>}>
    {items.map(({ id }) => (
      <div key={id}>
        <Item initialId={id} />
        <hr />
      </div>
    ))}
  </Suspense>
);

export default App;
