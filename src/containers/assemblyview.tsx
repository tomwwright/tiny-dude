import * as React from "react";

import {
  Paper,
  Typography,
  Grid,
  Chip,
  Avatar,
  IconButton,
  Button,
  Tooltip,
  FormControlLabel,
  Switch
} from "@material-ui/core";
import {
  FlightTakeoff as FlightTakeoffIcon,
  FlightLand as FlightLandIcon,
  HelpOutline as HelpOutlineIcon,
  ErrorOutline as ErrorOutlineIcon
} from "@material-ui/icons";
import { observer, inject } from "mobx-react";

import { Welcome } from "../components/welcome";
import { CodeHelpModal } from "../components/codehelpmodal";
import { ControlsHelpModal } from "../components/controlshelpmodal";
import MemoryGrid from "../components/memorygrid";
import OutputsGrid from "../components/outputsgrid";
import { AssemblyEditor } from "./assemblyeditor";

import ComputeStore from "../stores/compute";
import AssemblyStore from "../stores/assembly";
import RunStore from "../stores/run";
import UiStore from "../stores/ui";
import PlusEditor from "./tinydudepluseditor";

const controlRowHeight = 95;

const AssemblyViewComponent: React.StatelessComponent<{
  computeStore?: ComputeStore;
  assemblyStore?: AssemblyStore;
  runStore?: RunStore;
  uiStore?: UiStore;
}> = props => (
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
                <Typography variant="headline" component="h3">
                  Code.
                </Typography>
              </Grid>
              <Grid item>
                <Tooltip title="Open Code Help" placement="bottom">
                  <IconButton color="primary" aria-label="Open Code Help" onClick={() => props.uiStore.openCodeHelp()}>
                    <HelpOutlineIcon />
                  </IconButton>
                </Tooltip>
                <CodeHelpModal />
              </Grid>
            </Grid>
            {props.uiStore.isEditorInPlusMode ? <PlusEditor /> : <AssemblyEditor />}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <FormControlLabel
              control={
                <Switch checked={props.uiStore.isEditorInPlusMode} onChange={e => props.uiStore.setEditorPlusMode(e)} />
              }
              label="Code in TinyDude+"
            />
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
                <Typography variant="headline" component="h3">
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
                  variant="contained"
                  color="secondary"
                  disabled={!props.computeStore.isRunning || props.runStore.isRunning}
                  onClick={() => props.runStore.run(1000)}
                >
                  <FlightTakeoffIcon /> Start
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
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
            <Typography variant="headline" component="h3">
              Instruction.
            </Typography>
            <Typography variant="body1" component="p">
              {("0" + props.computeStore.counter).slice(-2)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={4}>
          <Paper style={{ height: `${controlRowHeight}px` }}>
            <Typography variant="headline" component="h3">
              Accumulator.{" "}
              {props.computeStore.hasOverOrUnderflowed && (
                <Chip
                  avatar={
                    <Avatar>
                      <ErrorOutlineIcon />
                    </Avatar>
                  }
                  label={props.computeStore.hasOverOrUnderflowed}
                />
              )}
            </Typography>
            <Typography variant="body1" component="p">
              {("00" + props.computeStore.accumulator).slice(-3)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <Typography variant="headline" component="h3">
              Memory.
            </Typography>
            <MemoryGrid />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <Typography variant="headline" component="h3">
              Outputs.
            </Typography>
            <OutputsGrid />
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  </Grid>
);

export const AssemblyView = inject("computeStore", "assemblyStore", "runStore", "uiStore")(
  observer(AssemblyViewComponent)
);
