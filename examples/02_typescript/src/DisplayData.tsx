// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import React, { useTransition } from 'react';

import { UserData } from './fetchFuncs';

type Props = {
  id: string;
  result: UserData;
  update: (id: string) => void;
};

const DisplayData: React.FC<Props> = ({ id, result, update }) => {
  const [startTransition, isPending] = useTransition({
    timeoutMs: 1000,
  });
  const onClick = () => {
    startTransition(() => {
      update(id);
    });
  };
  return (
    <div>
      <div>First Name: {result.data.first_name}</div>
      <button type="button" onClick={onClick}>Update</button>
      {isPending && 'Pending...'}
    </div>
  );
};

export default DisplayData;
