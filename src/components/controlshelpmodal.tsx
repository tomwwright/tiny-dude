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
      aria-labelledby="code-help-modal-title"
      show={props.uiStore.isCodeHelpOpen}
      onRequestClose={() => props.uiStore.closeCodeHelp()}
    >
      <Paper>
        <Typography type="title" id="code-help-modal-title">
          TinyDude Controls Help
        </Typography>
        <Typography type="body1">Yeah sweet.</Typography>
      </Paper>
    </Modal>
  </div>
);

export const ControlsHelpModal = inject('uiStore')(observer(ControlsHelpModalComponent));
