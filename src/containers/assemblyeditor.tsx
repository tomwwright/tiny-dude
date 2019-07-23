import * as React from "react";
import { inject, observer } from "mobx-react";
import { List, ListItem, ListItemIcon, ListItemText, Button, Typography, Grid } from "@material-ui/core";
import { WithStyles, withStyles, Theme } from "@material-ui/core/styles";
import { FileCopy as FileDownloadIcon, Error as ErrorIcon, Check as CheckIcon } from "@material-ui/icons";

import CodeEditor from "../components/codeeditor";
import Scrollable from "../components/scrollable";
import AssemblyStore from "../stores/assembly";
import ComputeStore from "../stores/compute";
import RunStore from "../stores/run";

const style = withStyles<string>((theme: Theme) => ({
  errorText: {
    color: theme.palette.error.main
  }
}));

type AssemblyEditorProps = {
  computeStore?: ComputeStore;
  assemblyStore?: AssemblyStore;
  runStore?: RunStore;
};

const highlightComments = (source: string) => source.replace(/(\/\/.*)/gi, '<span style="color: #666666">$1</span>');

const highlightSource = (source: string, highlightedLines: number[]) => {
  const lines = source.split("\n");
  for (const i of highlightedLines) {
    lines[i - 1] = `<span style="background-color: #EEEEEE">${lines[i - 1]}</span>`;
  }
  return lines.join("\n");
};

const AssemblyEditor: React.StatelessComponent<WithStyles & AssemblyEditorProps> = ({
  computeStore,
  assemblyStore,
  runStore,
  classes
}) => (
  <div>
    {assemblyStore.highlightedStatements &&
      "" /* this is necessary so that MobX sees this variable during rendering so it can track it */}
    <CodeEditor
      source={assemblyStore.source}
      hasError={assemblyStore.compiled.errors.length > 0}
      onChange={code => assemblyStore.compile(code)}
      highlight={code =>
        highlightComments(
          highlightSource(
            code,
            assemblyStore.highlightedStatements.map(
              statementi => assemblyStore.compiled.statements[statementi - 1].line
            )
          )
        )
      }
    />
    {assemblyStore.compiled.errors.length == 0 ? (
      <Grid container style={{ marginTop: 0 }} alignItems="center" justify="space-between">
        <Grid item>
          <ListItem>
            <ListItemIcon>
              <CheckIcon />
            </ListItemIcon>
            <ListItemText primary="Compiled!" secondary={`${assemblyStore.compiled.program.length} opcodes`} />
          </ListItem>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            disabled={runStore.isRunning || assemblyStore.compiled.program.length == 0}
            onClick={() => computeStore.init(assemblyStore.compiled.program)}
          >
            <FileDownloadIcon /> Load
          </Button>
        </Grid>
      </Grid>
    ) : (
      <Scrollable height={200}>
        <List dense={true}>
          {assemblyStore.compiled.errors.map((error, i) => (
            <ListItem key={i}>
              <ListItemIcon>
                <ErrorIcon className={classes.errorText} />
              </ListItemIcon>
              <ListItemText
                classes={{ textDense: classes.errorText }}
                primary={error.message}
                secondary={"Line " + error.line}
              />
            </ListItem>
          ))}
        </List>
      </Scrollable>
    )}
  </div>
);

export default inject("computeStore", "assemblyStore", "runStore")(style(observer(AssemblyEditor)));
