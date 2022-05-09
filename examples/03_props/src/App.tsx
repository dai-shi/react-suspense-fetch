import React, { Suspense } from 'react';

import Main from './Main';

const items = [
  { id: '1' },
  { id: '2' },
  { id: '3' },
];

const App = () => (
  <Suspense fallback={<span>Loading...</span>}>
    <Main items={items} />
  </Suspense>
);

export default App;
