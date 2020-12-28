import React, { useState } from 'react';

import { store } from './fetchFuncs';

const fileName = './slow_fib.wasm';
store.prefetch(fileName);

const CalcFib: React.FC = () => {
  const [count, setCount] = useState(0);
  const fib = store.get(fileName).exports.fib(count);
  return (
    <div>
      <div>fib({count}) = {fib}</div>
      <button type="button" onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  );
};

export default CalcFib;
