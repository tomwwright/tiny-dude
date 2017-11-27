import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Button } from 'rebass';

import ComputeStore from 'stores/compute';

type MemoryProps = {
  computeStore?: ComputeStore;
};

const Memory: React.StatelessComponent<MemoryProps> = ({ computeStore }) => (
  <div>
    <p>Acc: {('00' + computeStore.accumulator).slice(-3)}</p>
    <p>Outputs: {computeStore.outputs.join(', ')}</p>
    {computeStore.memory.map((value, i) => (
      <p key={i}>
        {('0' + i).slice(-2)}: {('00' + value).slice(-3)} {computeStore.counter == i ? '<' : ''}
      </p>
    ))}
    <Button onClick={() => computeStore.cycle()}>Cycle</Button>
  </div>
);

export default inject('computeStore')(observer(Memory));
