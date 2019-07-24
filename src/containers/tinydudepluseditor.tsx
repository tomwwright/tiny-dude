import * as React from "react";
import { inject, observer } from "mobx-react";
import { Button, Grid } from "@material-ui/core";
import { FileCopy as FileDownloadIcon } from "@material-ui/icons";

import CodeEditor from "../components/codeeditor";
import TinyDudePlusStore from "../stores/plus";
import AssemblyStore from "../stores/assembly";
import { CompilationSuccessMessage } from "../components/compilationsuccessmessage";
import { CompilationErrorReport } from "../components/compilationerrorreport";

type PlusEditorProps = {
  plusStore?: TinyDudePlusStore;
  assemblyStore?: AssemblyStore;
};

const colourKeywordsInSource = (source: string) =>
  source.replace(/(loop|num|bool|if|out|true|false)/gi, '<span style="color: #6666FF">$1</span>');

const highlightSource = (source: string, start: number, end: number) => {
  return `${source.substring(0, start)}<span style="background-color: #DDDDDD">${source.substring(
    start,
    end
  )}</span>${source.substring(end)}`;
};

const PlusEditor: React.StatelessComponent<PlusEditorProps> = ({ plusStore, assemblyStore }) => (
  <div>
    {plusStore.sourceHighlighting && ""}
    <CodeEditor
      source={plusStore.source}
      hasError={plusStore.compilation.errors.length > 0}
      onChange={code => plusStore.compile(code)}
      highlight={code =>
        colourKeywordsInSource(
          plusStore.sourceHighlighting
            ? highlightSource(code, plusStore.sourceHighlighting.start, plusStore.sourceHighlighting.end)
            : code
        )
      }
    />
    {plusStore.compilation.errors.length == 0 ? (
      <Grid container alignItems="center" justify="space-between">
        <Grid item>
          <CompilationSuccessMessage
            message={`${plusStore.compiledProgramStatementsLength} statements (${
              plusStore.compilation.assembly.length
            } opcodes)`}
          />
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={() => assemblyStore.compile(plusStore.compilation.source)}
          >
            <FileDownloadIcon /> LOAD ASSEMBLY
          </Button>
        </Grid>
      </Grid>
    ) : (
      <CompilationErrorReport errors={plusStore.compilation.errors.map(error => ({ message: error, line: 0 }))} />
    )}
  </div>
);

export default inject("plusStore", "assemblyStore")(observer(PlusEditor));
