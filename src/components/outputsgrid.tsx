import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Paper, Typography, Grid, ListItemText } from 'material-ui';
import { withStyles, WithStyles } from 'material-ui/styles';

import Scrollable from 'components/scrollable';
import ComputeStore from 'stores/compute';

type OutputsGridProps = {
  computeStore?: ComputeStore;
};

const styles = withStyles<string>(theme => ({
  outputCell: {
    margin: '5px',
    width: '50px',
  },
}));

const OutputsGrid: React.StatelessComponent<WithStyles & OutputsGridProps> = ({ computeStore, classes }) => {
  return (
    <Scrollable height={200}>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {computeStore.outputs.length > 0 ? (
          computeStore.outputs.map((output, i) => (
            <Paper key={i} className={classes.outputCell}>
              <ListItemText primary={('00' + output).slice(-3)} secondary={('0' + i).slice(-2)} />
            </Paper>
          ))
        ) : (
          <Paper className={classes.outputCell}>
            <ListItemText primary="---" secondary="--" />
          </Paper>
        )}
      </div>
    </Scrollable>
  );
};

export default inject('computeStore')(styles(observer(OutputsGrid)));
