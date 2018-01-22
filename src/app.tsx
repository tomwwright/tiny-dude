import * as ReactDOM from 'react-dom';
import * as React from 'react';

import { Provider } from 'mobx-react';

import ComputeStore from 'stores/compute';
import AssemblyStore from 'stores/assembly';
import RunStore from 'stores/run';
import UiStore from 'stores/ui';

import Root from 'containers/root';

const computeStore = new ComputeStore(100);
const assemblyStore = new AssemblyStore();
const runStore = new RunStore(computeStore);
const uiStore = new UiStore();

// debug
(window as any).stores = {
  compute: computeStore,
  assembly: assemblyStore,
  run: runStore,
  ui: uiStore,
};

ReactDOM.render(
  <Provider computeStore={computeStore} assemblyStore={assemblyStore} runStore={runStore} uiStore={uiStore}>
    <Root />
  </Provider>,
  document.getElementById('react-container')
);
