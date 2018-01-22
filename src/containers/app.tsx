import * as React from 'react';
import { inject, observer } from 'mobx-react';

import { Paper, Typography, Grid, TextField, IconButton, Button, Tooltip } from 'material-ui';
import {
  FlightTakeoff as FlightTakeoffIcon,
  FlightLand as FlightLandIcon,
  HelpOutline as HelpOutlineIcon,
} from 'material-ui-icons';
import { withStyles, WithStyles } from 'material-ui/styles';

import AppBar from 'components/appbar';
import MemoryGrid from 'components/memorygrid';
import OutputsGrid from 'components/outputsgrid';
import { CodeHelpModal } from 'components/codehelpmodal';
import AssemblyEditor from 'containers/assemblyeditor';
import ComputeStore from 'stores/compute';
import AssemblyStore from 'stores/assembly';
import RunStore from 'stores/run';
import UiStore from 'stores/ui';

const App: React.StatelessComponent<{
  computeStore?: ComputeStore;
  assemblyStore?: AssemblyStore;
  runStore?: RunStore;
  uiStore?: UiStore;
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
              <Grid container justify="space-between" alignItems="center">
                <Grid item>
                  <Typography type="headline" component="h3">
                    Code.
                  </Typography>
                </Grid>
                <Grid item>
                  <Tooltip title="Open Code Help" placement="bottom">
                    <IconButton
                      color="primary"
                      aria-label="Open Code Help"
                      onClick={() => props.uiStore.openCodeHelp()}
                    >
                      <HelpOutlineIcon />
                    </IconButton>
                  </Tooltip>
                  <CodeHelpModal />
                </Grid>
              </Grid>
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
          <Grid item xs={6}>
            <Paper style={{ height: '75px' }}>
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
          <Grid item xs={3}>
            <Paper style={{ height: '75px' }}>
              <Typography type="headline" component="h3">
                Instruction.
              </Typography>
              <Typography type="body1" component="p">
                {('0' + props.computeStore.counter).slice(-2)}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper style={{ height: '75px' }}>
              <Typography type="headline" component="h3">
                Accumulator.
              </Typography>
              <Typography type="body1" component="p">
                {('00' + props.computeStore.accumulator).slice(-3)}
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
          <Grid item xs={12}>
            <Paper>
              <Typography type="headline" component="h3">
                Outputs.
              </Typography>
              <OutputsGrid />
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  </div>
);

export default inject('computeStore', 'assemblyStore', 'runStore')(observer(App));
