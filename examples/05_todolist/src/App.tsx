import React, { Suspense } from 'react';

import TodoList from './TodoList';

const App: React.FC = () => (
  <Suspense fallback={<span>Loading...</span>}>
    <TodoList />
  </Suspense>
);

export default App;
