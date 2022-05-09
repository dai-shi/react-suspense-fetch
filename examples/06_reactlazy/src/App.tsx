import React, { Suspense } from 'react';

import Main from './Main';

const App = () => (
  <Suspense fallback={<span>Loading...</span>}>
    <Main />
  </Suspense>
);

export default App;
