import * as React from "react";
import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { Check as CheckIcon } from "@material-ui/icons";

type CompilationMessageProps = {
  message: string;
};

export const CompilationSuccessMessage: React.StatelessComponent<CompilationMessageProps> = props => (
  <ListItem>
    <ListItemIcon>
      <CheckIcon />
    </ListItemIcon>
    <ListItemText primary="Compiled!" secondary={props.message} />
  </ListItem>
);
