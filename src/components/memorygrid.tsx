import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Paper, Typography, Grid, ListItemText } from 'material-ui';

import Scrollable from 'components/scrollable';
import ComputeStore from 'stores/compute';

type MemoryProps = {
  computeStore?: ComputeStore;
};

const MemoryGrid: React.StatelessComponent<MemoryProps> = ({ computeStore }) => (
  <Scrollable height={200}>
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {computeStore.memory.map((memory, i) => (
        <Paper key={i} style={{ margin: '5px', width: '50px' }}>
          <ListItemText primary={('00' + memory).slice(-3)} secondary={('0' + i).slice(-2)} />
        </Paper>
      ))}
    </div>
  </Scrollable>
);

export default inject('computeStore')(observer(MemoryGrid));
