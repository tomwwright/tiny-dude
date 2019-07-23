import * as React from "react";
import { inject, observer } from "mobx-react";
import { Paper, Typography, Grid, ListItemText, Tooltip } from "@material-ui/core";
import { withStyles, WithStyles } from "@material-ui/core/styles";

import Scrollable from "./scrollable";
import ComputeStore from "../stores/compute";
import { MemoryCell } from "./memorycell";
import AssemblyStore from "../stores/assembly";

type MemoryProps = {
  computeStore?: ComputeStore;
  assemblyStore?: AssemblyStore;
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
  },
  unusedMemoryCell: {
    margin: "5px",
    width: "50px",
    backgroundColor: "#EEE"
  }
}));

function assignMemoryCellClass(
  classes: Record<string, string>,
  i: number,
  loadedMemoryLength: number,
  computeCounter: number,
  computeIsRunning: boolean
) {
  if (!computeIsRunning) return classes.memoryCell;

  if (i >= loadedMemoryLength) return classes.unusedMemoryCell;

  return computeCounter == i
    ? computeIsRunning
      ? classes.programCountMemoryCell
      : classes.programCountInactiveMemoryCell
    : classes.memoryCell;
}

const MemoryGrid: React.StatelessComponent<WithStyles & MemoryProps> = ({ computeStore, assemblyStore, classes }) => (
  <Scrollable height={200}>
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {computeStore.memory.map((memory, i) => {
        const memoryCellClassName = assignMemoryCellClass(
          classes,
          i,
          assemblyStore.compiled.program.length,
          computeStore.counter,
          computeStore.isRunning
        );

        return (
          <MemoryCell
            key={i}
            class={memoryCellClassName}
            memory={memory}
            assemblyStatement={computeStore.isRunning ? assemblyStore.compiled.statements[i] : null}
            index={i}
          />
        );
      })}
    </div>
  </Scrollable>
);

export default inject("computeStore", "assemblyStore")(styles(observer(MemoryGrid)));
