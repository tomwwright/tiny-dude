import * as ReactDOM from 'react-dom';
import * as React from 'react';

import { Provider } from 'mobx-react';

import ComputeStore from 'stores/compute';
import AssemblyStore from 'stores/assembly';

import Root from 'containers/root';

const computeStore = new ComputeStore(100);
const assemblyStore = new AssemblyStore();

// debug
(window as any).stores = {
  compute: computeStore,
  assembly: assemblyStore,
};

ReactDOM.render(
  <Provider computeStore={computeStore} assemblyStore={assemblyStore}>
    <Root />
  </Provider>,
  document.getElementById('react-container')
);
