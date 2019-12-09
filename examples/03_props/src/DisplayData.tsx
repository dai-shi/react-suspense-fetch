import React from 'react';

type Props = {
  id: string;
  result: { data: { first_name: string } };
};

const DisplayData: React.FC<Props> = ({ result }) => (
  <div>
    <div>First Name: {result.data.first_name}</div>
  </div>
);

export default DisplayData;
