import React, { Suspense } from 'react';

import { prepare } from 'react-suspense-fetch';

import { fetchFunc } from './fetchFuncs';
import Item from './Item';

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
