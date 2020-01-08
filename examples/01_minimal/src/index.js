import React, { Suspense, useState, useTransition } from 'react';
import ReactDOM from 'react-dom';

import { prefetch, refetch } from 'react-suspense-fetch';

const DisplayData = ({ result, update }) => {
  const [startTransition, isPending] = useTransition({
    timeoutMs: 1000,
  });
  const onClick = () => {
    startTransition(() => {
      update('2');
    });
  };
  return (
    <div>
      <div>First Name: {result.data.first_name}</div>
      <button type="button" onClick={onClick}>Refetch user 2</button>
      {isPending && 'Pending...'}
    </div>
  );
};

const fetchFunc = async (userId) => (await fetch(`https://reqres.in/api/users/${userId}?delay=3`)).json();
const initialResult = prefetch(fetchFunc, '1');

const Main = () => {
  const [result, setResult] = useState(initialResult);
  const update = (id) => {
    setResult(refetch(result, id));
  };
  return <DisplayData result={result} update={update} />;
};

const App = () => (
  <Suspense fallback={<span>Loading...</span>}>
    <Main />
  </Suspense>
);

ReactDOM.createRoot(document.getElementById('app')).render(<App />);
