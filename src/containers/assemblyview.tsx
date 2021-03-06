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
  ErrorOutline as ErrorOutlineIcon,
  Input as InputIcon
} from "@material-ui/icons";
import { observer, inject } from "mobx-react";

import { Welcome } from "../components/welcome";
import { CodeHelpModal } from "../components/codehelpmodal";
import { PlusCodeHelpModal } from "../components/PlusCodeHelpModal";
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
                <FormControlLabel
                  control={
                    <Switch
                      checked={props.uiStore.isEditorInPlusMode}
                      onChange={e => props.uiStore.setEditorPlusMode(e.target.checked)}
                    />
                  }
                  label="Code in TinyDude+"
                />
                <Tooltip title="Open Code Help" placement="bottom">
                  <IconButton
                    color="primary"
                    aria-label="Open Code Help"
                    onClick={() =>
                      props.uiStore.isEditorInPlusMode ? props.uiStore.openPlusCodeHelp() : props.uiStore.openCodeHelp()
                    }
                  >
                    <HelpOutlineIcon />
                  </IconButton>
                </Tooltip>
                <CodeHelpModal />
                <PlusCodeHelpModal />
              </Grid>
            </Grid>
            {props.uiStore.isEditorInPlusMode ? <PlusEditor /> : <AssemblyEditor />}
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
              <Grid item style={{ margin: "0px 8px" }}>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={props.runStore.isRunning || props.assemblyStore.compiled.program.length == 0}
                  onClick={() => props.computeStore.init(props.assemblyStore.compiled.program)}
                >
                  <InputIcon /> Load
                </Button>
              </Grid>
              <Grid item style={{ margin: "0px 8px" }}>
                <Button
                  variant="contained"
                  color="secondary"
                  disabled={!props.computeStore.isRunning || props.runStore.isRunning}
                  onClick={() => props.runStore.run()}
                >
                  <FlightTakeoffIcon /> Start
                </Button>
              </Grid>
              <Grid item style={{ margin: "0px 8px" }}>
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
            <Grid container justify="space-between" alignItems="center">
              <Grid item>
                <Typography variant="headline" component="h3">
                  Instruction.
                </Typography>
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={
                    <Switch
                      checked={props.runStore.isRunningInFastMode}
                      onChange={e => {
                        const setFastMode = e.target.checked;

                        props.runStore.setTickMs(setFastMode ? 200 : 1000);
                      }}
                    />
                  }
                  label="Run in Fast Mode"
                />
              </Grid>
            </Grid>
            <Typography variant="h6" component="p">
              {("00" + props.computeStore.counter).slice(-3)}
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
            <Typography variant="h6" component="p">
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
