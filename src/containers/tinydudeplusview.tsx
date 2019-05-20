import * as React from "react";
import { Grid, Paper } from "@material-ui/core";
import TinyDudePlusEditor from "./tinydudepluseditor";
import AssemblyEditor from "./assemblyeditor";

export const PlusView: React.StatelessComponent = () => (
  <Grid container>
    <Grid item sm={12} md={4}>
      <Paper>
        <TinyDudePlusEditor />
      </Paper>
    </Grid>
    <Grid item sm={12} md={4}>
      <Paper>
        <AssemblyEditor />
      </Paper>
    </Grid>
  </Grid>
);
