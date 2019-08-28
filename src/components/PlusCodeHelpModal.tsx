import * as React from "react";
import { inject, observer } from "mobx-react";
import { Paper, Modal, Typography } from "@material-ui/core";

import UiStore from "../stores/ui";
import { Code } from "./code";

type PlusCodeHelpModalComponentProps = {
  uiStore?: UiStore;
};

const PlusCodeHelpModalComponent: React.StatelessComponent<PlusCodeHelpModalComponentProps> = props => (
  <div>
    <Modal
      aria-labelledby="plus-code-help-modal-title"
      open={props.uiStore.isPlusCodeHelpOpen}
      onClose={() => props.uiStore.closePlusCodeHelp()}
    >
      <Paper
        style={{ position: "absolute", top: "10%", left: "25%", width: "50%", maxHeight: "80%", overflowY: "scroll" }}
      >
        <Typography variant="headline" id="controls-help-modal-title">
          TinyDude+ Code Help.
        </Typography>

        <div style={{ height: "20px" }} />

        <Code>
          {
            "\
// == TinyDude+ == \n\
\n\
// TinyDude+ is a simple, C-like language built by @tomwwright to \n\
// learn about compiling! It is parsed using peg.js then compiled \n\
// to TinyDude assembly code. \n\
\n\
// == Features ==  \n\
\n\
// Comments  \n\
// I'm a comment! I extend from // to the end of the line!  \n\
\n\
// Variables \n\
bool b = false; // boolean type \n\
num n = 3;      // number type   \n\
\n\
// Assignment  \n\
b = true;  \n\
n = 4;  \n\
\n\
// Output  \n\
out n;  \n\
\n\
// Logical operators  \n\
bool c = not b; \n\
c = b and c; \n\
c = b or c;  \n\
b = (n >= 7) or (n <= 3) or (n == 5);  \n\
\n\
// WARN: operators < and > not supported!  \n\
\n\
// Arithmetic operators  \n\
n = (n + 3) - 5;  \n\
\n\
// WARN: operators * / % not supported!  \n\
\n\
// Conditional  \n\
if n == 5 {  \n\
  n = n + n;  \n\
  out n;  \n\
} \n\
\n\
// Loop  \n\
loop n >= 0 {  \n\
  out n;  \n\
  n = n - 1;  \n\
} \n"
          }
        </Code>
      </Paper>
    </Modal>
  </div>
);

export const PlusCodeHelpModal = inject("uiStore")(observer(PlusCodeHelpModalComponent));
