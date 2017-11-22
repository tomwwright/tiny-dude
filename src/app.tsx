import * as ReactDOM from 'react-dom';
import * as React from 'react';

import { Provider } from 'mobx-react';

import ComputeStore from 'stores/compute';
import Root from 'containers/root';

const computeStore = new ComputeStore(25);

// debuf
(window as any).stores = {
  compute: computeStore
};

ReactDOM.render(
  <Provider computeStore={computeStore}>
    <Root />
  </Provider>,
  document.getElementById('react-container')
);