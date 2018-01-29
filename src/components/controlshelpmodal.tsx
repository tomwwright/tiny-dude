import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Paper, Modal, Typography } from 'material-ui';

import UiStore from 'stores/ui';

type ControlsHelpModalComponentProps = {
  uiStore?: UiStore;
};

const ControlsHelpModalComponent: React.StatelessComponent<ControlsHelpModalComponentProps> = props => (
  <div>
    <Modal
      aria-labelledby="controls-help-modal-title"
      show={props.uiStore.isControlsHelpOpen}
      onRequestClose={() => props.uiStore.closeControlsHelp()}
    >
      <Paper
        style={{ position: 'absolute', top: '10%', left: '25%', width: '50%', maxHeight: '80%', overflowY: 'scroll' }}
      >
        <Typography type="headline" id="controls-help-modal-title">
          TinyDude Help.
        </Typography>

        <div style={{ height: '20px' }} />

        <Typography type="subheading" component="h3">
          Code.
        </Typography>
        <Typography type="body1">
          Enter your TinyDude program in the provided input box, then click <b>Load</b> to load your program into
          TinyDude.
        </Typography>

        <div style={{ height: '20px' }} />

        <Typography type="subheading" component="h3">
          Run.
        </Typography>
        <Typography type="body1">
          Click <b>Start</b> and TinyDude will begin executing your program, one instruction each second. You can
          examine the state on TinyDude via the <b>Program Counter</b>, <b>Accumulator</b>, <b>Memory</b> and{' '}
          <b>Output</b> areas provided. TinyDude will halt execution when it executes a <i>HLT</i> instruction.
        </Typography>

        <div style={{ height: '20px' }} />

        <Typography type="subheading" component="h3">
          Stop and Reset.
        </Typography>
        <Typography type="body1" component="p">
          Click <b>Stop</b> while TinyDude is executing to halt the execution early. Once halted, press <b>Start</b> if
          you wish to resume execution, or edit your program and click <b>Load</b> to reset TinyDude with your new
          program.
        </Typography>
      </Paper>
    </Modal>
  </div>
);

export const ControlsHelpModal = inject('uiStore')(observer(ControlsHelpModalComponent));
