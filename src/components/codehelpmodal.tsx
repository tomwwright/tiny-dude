import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Paper, Modal, Typography } from 'material-ui';

import UiStore from 'stores/ui';
import { Code } from 'components/code';

type CodeHelpModalComponentProps = {
  uiStore?: UiStore;
};

const CodeHelpModalComponent: React.StatelessComponent<CodeHelpModalComponentProps> = props => (
  <div>
    <Modal
      aria-labelledby="code-help-modal-title"
      show={props.uiStore.isCodeHelpOpen}
      onRequestClose={() => props.uiStore.closeCodeHelp()}
    >
      <Paper
        style={{ position: 'absolute', top: '10%', left: '25%', width: '50%', maxHeight: '80%', overflowY: 'scroll' }}
      >
        <Typography type="headline" id="controls-help-modal-title">
          TinyDude Code Help.
        </Typography>

        <div style={{ height: '20px' }} />

        <Typography type="subheading" component="h3">
          Wikipedia.
        </Typography>
        <Typography type="body1">
          The Wikipedia page for the Little Man Computer (LMC) is really good, you should just{' '}
          <a target="about:blank" href="https://en.wikipedia.org/wiki/Little_man_computer">
            check that out
          </a>.
        </Typography>

        <div style={{ height: '20px' }} />

        <Typography type="subheading" component="h3">
          INP No-op.
        </Typography>
        <Typography type="body1">
          TinyDude does not support the <i>INP</i> (input) instruction, any <i>INP</i> instruction will simply be
          executed as an <i>OUT</i> (output) instruction.
        </Typography>

        <div style={{ height: '20px' }} />

        <Typography type="subheading" component="h3">
          Comments.
        </Typography>
        <Typography type="body1">
          TinyDude supports Java-style single line comments (i.e. "// this is a comment")
        </Typography>

        <div style={{ height: '20px' }} />

        <Typography type="subheading" component="h3">
          Example 1: Count down from five.
        </Typography>
        <Code
          lines={'\
      LDA COUNT \n\
LOOP  BRZ QUIT // if the accumulator value is 0, jump to label QUIT \n\
      OUT      // output our current accumulator \n\
      SUB ONE  // subtract the value stored at address ONE from the accumulator \n\
      BRA LOOP // jump to label LOOP \n\
QUIT  HLT      // label this memory address as QUIT \n\
COUNT DAT 5    // store 5 here, and label it COUNT \n\
ONE   DAT 1    // store 1 here, and label it ONE'.split(
            '\n'
          )}
        />

        <div style={{ height: '20px' }} />

        <Typography type="subheading" component="h3">
          Example 2: Square the number three.
        </Typography>
        <Code
          lines={'\
      LDA NUM   // load the num to square\n\
      STA COUNT // store how many times we need to sum\n\
\n\
LOOP  BRZ DONE  // if accumulator (loop count) is zero, exit our summing loop\n\
      LDA SUM   // load our total thus far\n\
      ADD NUM   // add our number to it\n\
      STA SUM   // store new total \n\
      LDA COUNT // load our loop count \n\
      SUB ONE   // subtract one from loop count\n\
      STA COUNT // store our new loop count\n\
      BRA LOOP  // jump to top of the loop\n\
\n\
DONE  LDA SUM   // load our final total\n\
      OUT       // output our total\n\
      HLT       // fin\n\
\n\
NUM   DAT 3     \n\
ONE   DAT 1     \n\
SUM   DAT 0     \n\
COUNT DAT 0'.split(
            '\n'
          )}
        />
      </Paper>
    </Modal>
  </div>
);

export const CodeHelpModal = inject('uiStore')(observer(CodeHelpModalComponent));
