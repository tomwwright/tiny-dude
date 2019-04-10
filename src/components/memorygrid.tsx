import * as React from "react";
import { inject, observer } from "mobx-react";
import { Paper, Typography, Grid, ListItemText } from "@material-ui/core";
import { withStyles, WithStyles } from "@material-ui/core/styles";

import Scrollable from "./scrollable";
import ComputeStore from "../stores/compute";

type MemoryProps = {
  computeStore?: ComputeStore;
};

const styles = withStyles<string>(theme => ({
  memoryCell: {
    margin: "5px",
    width: "50px"
  },
  programCountMemoryCell: {
    border: `1px solid ${theme.palette.primary.main}`,
    margin: "4px",
    width: "50px"
  },
  programCountInactiveMemoryCell: {
    border: `1px solid ${theme.palette.grey.A400}`,
    margin: "4px",
    width: "50px"
  }
}));

const MemoryGrid: React.StatelessComponent<WithStyles & MemoryProps> = ({ computeStore, classes }) => (
  <Scrollable height={200}>
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {computeStore.memory.map((memory, i) => (
        <Paper key={i} className={computeStore.counter == i ? (computeStore.isRunning ? classes.programCountMemoryCell : classes.programCountInactiveMemoryCell) : classes.memoryCell}>
          <ListItemText primary={("00" + memory).slice(-3)} secondary={("0" + i).slice(-2)} />
        </Paper>
      ))}
    </div>
  </Scrollable>
);

export default inject("computeStore")(styles(observer(MemoryGrid)));
