import * as React from "react";
import { inject, observer } from "mobx-react";
import { List, ListItem, ListItemIcon, ListItemText, Button, Typography, Grid } from "@material-ui/core";
import { WithStyles, withStyles, Theme } from "@material-ui/core/styles";
import { FileCopy as FileDownloadIcon, Error as ErrorIcon, Check as CheckIcon } from "@material-ui/icons";

import CodeEditor from "../components/codeeditor";
import Scrollable from "../components/scrollable";
import TinyDudePlusStore from "../stores/plus";
import AssemblyStore from "../stores/assembly";
import UiStore from "../stores/ui";

const style = withStyles<string>((theme: Theme) => ({
  errorText: {
    color: theme.palette.error.main
  }
}));

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

const PlusEditor: React.StatelessComponent<WithStyles & PlusEditorProps> = ({ plusStore, assemblyStore, classes }) => (
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
      <Grid container style={{ marginTop: 0 }} alignItems="center" justify="space-between">
        <Grid item>
          <ListItem>
            <ListItemIcon>
              <CheckIcon />
            </ListItemIcon>
            <ListItemText
              primary="Compiled!"
              secondary={`${plusStore.compiledProgramStatementsLength} statements (${
                plusStore.compilation.assembly.length
              } opcodes)`}
            />
          </ListItem>
        </Grid>
        <Grid item>
          <Button color="primary" onClick={() => assemblyStore.compile(plusStore.compilation.source)}>
            <FileDownloadIcon /> Load
          </Button>
        </Grid>
      </Grid>
    ) : (
      <Scrollable height={200}>
        <List dense={true}>
          {plusStore.compilation.errors.map((error, i) => (
            <ListItem key={i}>
              <ListItemIcon>
                <ErrorIcon className={classes.errorText} />
              </ListItemIcon>
              <ListItemText classes={{ textDense: classes.errorText }} primary={error} secondary={"Line ??"} />
            </ListItem>
          ))}
        </List>
      </Scrollable>
    )}
  </div>
);

export default inject("plusStore", "assemblyStore")(style(observer(PlusEditor)));
