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

const highlightComments = (source: string) => source.replace(/(\/\/.*)/gi, '<span style="color: #666666">$1</span>');

const highlightSource = (source: string, start: number, end: number) => {
  return `${source.substring(0, start)}<span style="background-color:  rgba(130, 130, 130, 0.3);}">${source.substring(
    start,
    end
  )}</span>${source.substring(end)}`;
};

const handleCodeChange = (source: string, plusStore: TinyDudePlusStore, assemblyStore: AssemblyStore) => {
  plusStore.compile(source);

  if (plusStore.compilation.errors.length == 0) {
    assemblyStore.compile(plusStore.compilation.source);
  }
};

const PlusEditor: React.StatelessComponent<PlusEditorProps> = ({ plusStore, assemblyStore }) => (
  <div>
    {plusStore.sourceHighlighting && ""}
    <CodeEditor
      source={plusStore.source}
      hasError={plusStore.compilation.errors.length > 0}
      onChange={code => handleCodeChange(code, plusStore, assemblyStore)}
      highlight={code =>
        highlightComments(
          colourKeywordsInSource(
            plusStore.sourceHighlighting
              ? highlightSource(code, plusStore.sourceHighlighting.start, plusStore.sourceHighlighting.end)
              : code
          )
        )
      }
    />
    {plusStore.compilation.errors.length == 0 ? (
      <CompilationSuccessMessage
        message={`${plusStore.compiledProgramStatementsLength} statements (${
          plusStore.compilation.assembly.length
        } opcodes)`}
      />
    ) : (
      <CompilationErrorReport errors={plusStore.compilation.errors} />
    )}
  </div>
);

export default inject("plusStore", "assemblyStore")(observer(PlusEditor));
