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
      onRequestClose={() => props.uiStore.closeControlsHelpModal()}
    >
      <Paper>
        <Typography type="title" id="controls-help-modal-title">
          TinyDude Controls Help
        </Typography>
        <Typography type="body1">Yeah sweet.</Typography>
      </Paper>
    </Modal>
  </div>
);

export const ControlsHelpModal = inject('uiStore')(observer(ControlsHelpModalComponent));
