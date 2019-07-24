import * as React from "react";
import { inject, observer } from "mobx-react";
import { ListItem, ListItemIcon, ListItemText, Button, Grid } from "@material-ui/core";
import { FileCopy as FileDownloadIcon, Check as CheckIcon } from "@material-ui/icons";

import CodeEditor from "../components/codeeditor";
import AssemblyStore from "../stores/assembly";
import ComputeStore from "../stores/compute";
import RunStore from "../stores/run";
import { CompilationErrorReport } from "../components/compilationerrorreport";
import { CompilationSuccessMessage } from "../components/compilationsuccessmessage";

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

const AssemblyEditorComponent: React.StatelessComponent<AssemblyEditorProps> = ({
  computeStore,
  assemblyStore,
  runStore
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
      <Grid container alignItems="center" justify="space-between">
        <Grid item>
          <CompilationSuccessMessage message={`${assemblyStore.compiled.program.length} opcodes`} />
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
      <CompilationErrorReport errors={assemblyStore.compiled.errors} />
    )}
  </div>
);

export const AssemblyEditor = inject("computeStore", "assemblyStore", "runStore")(observer(AssemblyEditorComponent));
