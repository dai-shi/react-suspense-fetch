import React from 'react';

import { store } from './fetchFuncs';
import Item from './Item';

const Main = ({ items }: { items: { id: string }[] }) => {
  items.forEach(({ id }) => {
    store.prefetch(id);
  });
  return (
    <>
      {items.map(({ id }) => (
        <div key={id}>
          <Item id={id} />
          <hr />
        </div>
      ))}
    </>
  );
};

export default Main;
