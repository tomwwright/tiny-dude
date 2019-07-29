import * as React from "react";

import Scrollable from "./scrollable";
import { List, ListItem, ListItemIcon, withStyles, Theme, WithStyles, ListItemText } from "@material-ui/core";
import { Error as ErrorIcon } from "@material-ui/icons";
import { AssemblyCompiler } from "../models/assemblycompiler";

const style = withStyles<string>((theme: Theme) => ({
  errorText: {
    color: theme.palette.error.main
  }
}));

type CompilationErrorReportProps = {
  errors: Array<{ message: string; line?: number }>;
};

const CompilationErrorReportComponent: React.StatelessComponent<WithStyles & CompilationErrorReportProps> = ({
  errors,
  classes
}) => (
  <Scrollable height={200}>
    <List dense={true}>
      {errors.map((error, i) => (
        <ListItem key={i}>
          <ListItemIcon>
            <ErrorIcon className={classes.errorText} />
          </ListItemIcon>
          <ListItemText
            classes={{ textDense: classes.errorText }}
            primary={error.message}
            secondary={"Line " + (error.line ? error.line : "??")}
          />
        </ListItem>
      ))}
    </List>
  </Scrollable>
);

export const CompilationErrorReport = style(CompilationErrorReportComponent);
