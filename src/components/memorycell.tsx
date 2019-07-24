import * as React from "react";
import { Tooltip, Typography, Paper, Grid } from "@material-ui/core";
import { AssemblyStatement, OpCodeNames, generateAssemblyStatementDescription } from "../models/assemblycompiler";

type MemoryCellProps = {
  class: string;
  index: number;
  memory: number;
  assemblyStatement?: AssemblyStatement;
};

export const MemoryCell = (props: MemoryCellProps) => (
  <Tooltip
    title={
      !props.assemblyStatement ? (
        "Empty memory cell"
      ) : (
        <React.Fragment>
          <Typography color="inherit">
            {props.assemblyStatement.instruction} - {OpCodeNames[props.assemblyStatement.instruction]}{" "}
            {props.assemblyStatement.label ? `[Label: ${props.assemblyStatement.label}]` : ""}
          </Typography>
          {generateAssemblyStatementDescription(props.assemblyStatement)}
        </React.Fragment>
      )
    }
    placement="right"
  >
    <Paper className={props.class}>
      <Typography variant="h6">{("00" + props.memory).slice(-3)}</Typography>
      <Grid container justify="space-between">
        <Grid item>
          <Typography variant="body1" style={{ color: "#666" }}>
            {("0" + props.index).slice(-2)}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body1" style={{ color: "#666" }}>
            {props.assemblyStatement ? props.assemblyStatement.instruction : "---"}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  </Tooltip>
);
