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
import { Welcome } from 'components/welcome';
import { CodeHelpModal } from 'components/codehelpmodal';
import { ControlsHelpModal } from 'components/controlshelpmodal';
import AssemblyEditor from 'containers/assemblyeditor';
import { Footer } from 'components/footer';
import ComputeStore from 'stores/compute';
import AssemblyStore from 'stores/assembly';
import RunStore from 'stores/run';
import UiStore from 'stores/ui';

const controlRowHeight = 95;

const App: React.StatelessComponent<{
  computeStore?: ComputeStore;
  assemblyStore?: AssemblyStore;
  runStore?: RunStore;
  uiStore?: UiStore;
}> = props => (
  <div>
    <div style={{ minHeight: '100%' }}>
      <AppBar githubUrl="https://github.com/tomwwright/tiny-dude" />
      <Grid container>
        <Grid item sm={12} md={4}>
          <Grid container>
            <Grid item xs={12}>
              <Welcome emptyProp="" />
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
            <Grid item xs={12} md={4}>
              <Paper style={{ minHeight: `${controlRowHeight}px` }}>
                <Grid container justify="space-between" alignItems="center">
                  <Grid item>
                    <Typography type="headline" component="h3">
                      Controls.
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Tooltip title="Open Controls Help" placement="bottom">
                      <IconButton
                        color="primary"
                        aria-label="Open Controls Help"
                        onClick={() => props.uiStore.openControlsHelp()}
                      >
                        <HelpOutlineIcon />
                      </IconButton>
                    </Tooltip>
                    <ControlsHelpModal />
                  </Grid>
                </Grid>
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
            <Grid item xs={6} md={4}>
              <Paper style={{ height: `${controlRowHeight}px` }}>
                <Typography type="headline" component="h3">
                  Instruction.
                </Typography>
                <Typography type="body1" component="p">
                  {('0' + props.computeStore.counter).slice(-2)}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} md={4}>
              <Paper style={{ height: `${controlRowHeight}px` }}>
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
      <div style={{ height: '70px' }} />
    </div>
    <Footer>
      <Typography type="caption" component="p" style={{ textAlign: 'center' }}>
        TinyDude by Tom Wright{' '}
      </Typography>
      <Typography type="caption" component="p" style={{ textAlign: 'center' }}>
        <a style={{ color: 'inherit' }} href="https://tomwwright.com">
          tomwwright.com
        </a>
      </Typography>
    </Footer>
  </div>
);

export default inject('computeStore', 'assemblyStore', 'runStore', 'uiStore')(observer(App));
