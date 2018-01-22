import * as React from 'react';
import { inject, observer } from 'mobx-react';

import { Paper, Typography, Grid, TextField, Button } from 'material-ui';
import { FileDownload as FileDownloadIcon, FlightTakeoff as FlightTakeoffIcon } from 'material-ui-icons';

import AppBar from 'components/appbar';
import MemoryGrid from 'components/memorygrid';
import AssemblyEditor from 'containers/assemblyeditor';
import ComputeStore from 'stores/compute';
import AssemblyStore from 'stores/assembly';
import RunStore from 'stores/run';

const App: React.StatelessComponent<{
  computeStore?: ComputeStore;
  assemblyStore?: AssemblyStore;
  runStore?: RunStore;
}> = props => (
  <div>
    <AppBar githubUrl="https://github.com/tomwwright/tiny-dude" />
    <Grid container>
      <Grid item sm={12} md={4}>
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
                Code.
              </Typography>
              <AssemblyEditor />
            </Paper>
          </Grid>
        </Grid>
      </Grid>

      <Grid item sm={12} md={8}>
        <Grid container>
          <Grid item xs={12}>
            <Paper>
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
              <Grid container>
                <Grid item>
                  <Button
                    raised
                    color="accent"
                    disabled={!props.computeStore.isRunning || props.runStore.isRunning}
                    onClick={() => props.runStore.run(1000)}
                  >
                    <FlightTakeoffIcon /> Start
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    raised
                    color="primary"
                    disabled={!props.runStore.isRunning}
                    onClick={() => props.runStore.stop()}
                  >
                    <FlightLandIcon /> Stop
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper>
              <Typography type="headline" component="h3">
                Instruction.
              </Typography>
              <Typography type="body1" component="p">
                {('0' + props.computeStore.counter).slice(-2)}
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
                [ {props.computeStore.outputs.map(output => ('00' + output).slice(-3)).join(', ')} ]
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

export default inject('computeStore', 'assemblyStore', 'runStore')(observer(App));
