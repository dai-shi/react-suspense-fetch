import React, { useState } from 'react';

import { store } from './fetchFuncs';
import DisplayData from './DisplayData';

type Props = {
  initialId: string;
};

const Item: React.FC<Props> = ({ initialId }) => {
  const [text, setText] = useState(initialId);
  const [id, setId] = useState(initialId);
  const result = store.get(id);
  const update = (nextId: string) => {
    store.prefetch(nextId);
    setId(nextId);
  };
  return (
    <div>
      User ID: <input value={text} onChange={(e) => setText(e.target.value)} />
      <DisplayData id={text} result={result} update={update} />
    </div>
  );
};

export default Item;
