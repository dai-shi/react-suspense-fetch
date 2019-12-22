import React, { Suspense } from 'react';

import CalcFib from './CalcFib';

const App: React.FC = () => (
  <Suspense fallback={<span>Loading...</span>}>
    <CalcFib />
  </Suspense>
);

export default App;
