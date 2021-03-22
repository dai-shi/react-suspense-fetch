import React, { useState } from 'react';

import { store, mutate } from './fetchFuncs';
import DisplayData from './DisplayData';

type Props = {
  initialId: string;
};

const Item: React.FC<Props> = ({ initialId }) => {
  const [text, setText] = useState(initialId);
  const result = store.get(text);
  const update = (first_name: string) => {
    mutate(initialId, first_name).then(() => {
      store.refetch(initialId);
    });
  };
  return (
    <div>
      User ID: <input value={text} onChange={(e) => setText(e.target.value)} />
      <DisplayData result={result} update={update} />
    </div>
  );
};

export default Item;
