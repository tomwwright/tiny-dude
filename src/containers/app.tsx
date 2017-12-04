import * as React from 'react';
import { inject, observer } from 'mobx-react';

import { Paper, Typography, Grid, TextField, Button } from 'material-ui';
import AppBar from 'components/appbar';
import MemoryGrid from 'components/memorygrid';
import AssemblyEditor from 'containers/assemblyeditor';
import ComputeStore from 'stores/compute';
import AssemblyStore from 'stores/assembly';

const App: React.StatelessComponent<{ computeStore?: ComputeStore; assemblyStore?: AssemblyStore }> = props => (
  <div>
    <AppBar />
    <Grid container>
      <Grid item xs={12} sm={4}>
        <Paper>
          <Typography type="headline" component="h3">
            Code.
          </Typography>
          <AssemblyEditor />
        </Paper>
      </Grid>

      <Grid item xs={12} sm={8}>
        <Grid container>
          <Grid item xs={12}>
            <Paper>
              <Typography type="headline" component="h3">
                Welcome.
              </Typography>
              <Typography type="body1" component="p">
                Information and stuff will go here.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper>
              <Typography type="headline" component="h3">
                Controls.
              </Typography>
              <Button
                raised
                color="primary"
                disabled={!props.computeStore.isRunning}
                onClick={() => props.computeStore.cycle()}
              >
                Cycle
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper>
              <Typography type="headline" component="h3">
                Instruction.
              </Typography>
              <Typography type="body1" component="p">
                {('00' + props.computeStore.counter).slice(-3)}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper>
              <Typography type="headline" component="h3">
                Accumulator.
              </Typography>
              <Typography type="body1" component="p">
                {('00' + props.computeStore.accumulator).slice(-3)}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper>
              <Typography type="headline" component="h3">
                Outputs.
              </Typography>
              <Typography type="body1" component="p">
                {props.computeStore.outputs.map(output => ('00' + output).slice(-3)).join(', ')}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper>
              <Typography type="headline" component="h3">
                Memory.
              </Typography>
              <MemoryGrid />
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  </div>
);

export default inject('computeStore', 'assemblyStore')(observer(App));
