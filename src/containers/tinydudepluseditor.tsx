import * as React from "react";
import { inject, observer } from "mobx-react";
import { List, ListItem, ListItemIcon, ListItemText, Button, Typography, Grid } from "@material-ui/core";
import { WithStyles, withStyles, Theme } from "@material-ui/core/styles";
import { FileCopy as FileDownloadIcon, Error as ErrorIcon, Check as CheckIcon } from "@material-ui/icons";

import CodeEditor from "../components/codeeditor";
import Scrollable from "../components/scrollable";
import TinyDudePlusStore from "../stores/plus";
import AssemblyStore from "../stores/assembly";

const style = withStyles<string>((theme: Theme) => ({
  errorText: {
    color: theme.palette.error.main
  }
}));

type PlusEditorProps = {
  plusStore?: TinyDudePlusStore;
  assemblyStore?: AssemblyStore;
};

const PlusEditor: React.StatelessComponent<WithStyles & PlusEditorProps> = ({ plusStore, assemblyStore, classes }) => (
  <div>
    <CodeEditor
      source={plusStore.source}
      hasError={plusStore.compiler.errors.length > 0}
      onChange={code => plusStore.compile(code)}
    />
    {plusStore.compiler.errors.length == 0 ? (
      <Grid container style={{ marginTop: 0 }} alignItems="center" justify="space-between">
        <Grid item>
          <ListItem>
            <ListItemIcon>
              <CheckIcon />
            </ListItemIcon>
            <ListItemText primary="Compiled!" secondary={`${plusStore.compiler.ast.statements.length} statements`} />
          </ListItem>
        </Grid>
        <Grid item>
          <Button color="primary" onClick={() => assemblyStore.compile(plusStore.compiler.source)}>
            <FileDownloadIcon /> Load
          </Button>
        </Grid>
      </Grid>
    ) : (
      <Scrollable height={200}>
        <List dense={true}>
          {plusStore.compiler.errors.map((error, i) => (
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
