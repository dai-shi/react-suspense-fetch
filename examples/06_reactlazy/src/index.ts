import React from 'react';
import {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  createRoot,
} from 'react-dom';

import App from './App';

createRoot(document.getElementById('app')).render(React.createElement(App));
