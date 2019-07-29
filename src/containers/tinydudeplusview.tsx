import * as React from "react";
import { Grid, Paper, Typography, Button } from "@material-ui/core";

import { ChevronLeft as ChevronLeftIcon } from "@material-ui/icons";
import { inject, observer } from "mobx-react";

import TinyDudePlusEditor from "./tinydudepluseditor";
import { AssemblyEditor } from "./assemblyeditor";
import TinyDudePlusStore from "../stores/plus";
import AssemblyStore from "../stores/assembly";
import { ASTNode } from "../components/ast";
import { AdapterLink } from "../components/adapterlink";

type PlusViewProps = {
  plusStore?: TinyDudePlusStore;
  assemblyStore?: AssemblyStore;
};

const PlusViewComponent: React.StatelessComponent<PlusViewProps> = props => (
  <Grid container>
    <Grid item sm={12} md={4}>
      <Paper>
        <Typography variant="headline" component="h3">
          TinyDude+.
        </Typography>
        <TinyDudePlusEditor />
      </Paper>
      <Paper>
        <Button variant="contained" color="primary" component={props => <AdapterLink {...props} to="/" />}>
          <ChevronLeftIcon /> Back
        </Button>
      </Paper>
    </Grid>
    <Grid item sm={12} md={4}>
      <Paper>
        <Typography variant="headline" component="h3">
          AST.
        </Typography>
        {props.plusStore.compilation && props.plusStore.compilation.ast ? (
          <ASTNode
            node={props.plusStore.compilation.ast}
            onUnhover={node => props.plusStore.clearHighlightedSource()}
            onHover={node =>
              node.location &&
              props.plusStore.setHighlightedSource(node.location.start.offset, node.location.end.offset)
            }
          />
        ) : (
          <Typography variant="body1">No AST generated.</Typography>
        )}
      </Paper>
    </Grid>
    <Grid item sm={12} md={4}>
      <Paper>
        <Typography variant="headline" component="h3">
          TinyDude Assembly.
        </Typography>
        <AssemblyEditor />
      </Paper>
    </Grid>
  </Grid>
);

export const PlusView = inject("plusStore", "assemblyStore")(observer(PlusViewComponent));
