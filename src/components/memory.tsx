import * as React from 'react';
import { inject, observer } from 'mobx-react';

import ComputeStore from 'stores/compute';

type MemoryProps = {
  computeStore?: ComputeStore;
}

const Memory: React.StatelessComponent<MemoryProps> = ({ computeStore }) => (
  <div>
    <p>Acc: {("00" + computeStore.accumulator).slice(-3)}</p>
    {computeStore.memory.map((value, i) =>
      <p key={i}>{("0" + i).slice(-2)}: {("00" + value).slice(-3)} {computeStore.counter == i ? '<' : ''}</p>
    )}
  </div>
);

export default inject('computeStore')(observer(Memory));