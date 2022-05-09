import React from 'react';

type Props = {
  result: { data: { first_name: string } };
};

const DisplayData = ({ result }: Props) => (
  <div>
    <div>First Name: {result.data.first_name}</div>
  </div>
);

export default DisplayData;
