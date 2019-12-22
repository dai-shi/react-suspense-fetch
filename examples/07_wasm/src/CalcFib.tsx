import React, { useState } from 'react';

import { prefetch } from 'react-suspense-fetch';

import { fetchWasm } from './fetchFuncs';

const calcFib = prefetch(fetchWasm, './slow_fib.wasm');

const CalcFib: React.FC = () => {
  const [count, setCount] = useState(0);
  const fib = calcFib.exports.fib(count);
  return (
    <div>
      <div>fib({count}) = {fib}</div>
      <button type="button" onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  );
};

export default CalcFib;
