import * as React from 'react';
import { Input } from 'material-ui';
import { withStyles, WithStyles, Theme } from 'material-ui/styles';

const styles = withStyles<string>((theme: Theme) => ({
  input: {
    fontFamily: 'Courier New',
  },
  border: {
    border: `1px solid ${theme.palette.grey.A400}`,
    padding: '5px',
  },
  borderError: {
    border: `1px solid ${theme.palette.error.A400}`,
    padding: '5px',
  },
}));

type CodeEditorProps = {
  source: string;
  onChange: (value: string) => void;
  hasError?: boolean;
};

const CodeEditor: React.StatelessComponent<WithStyles & CodeEditorProps> = ({ onChange, source, classes, hasError }) => (
  <div className={hasError ? classes.borderError : classes.border}>
    <Input
      className={classes.input}
      value={source}
      disableUnderline={true}
      rows={20}
      fullWidth={true}
      rowsMax={20}
      multiline={true}
      onChange={event => onChange(event.target.value)}
    />
  </div>
);

export default styles(CodeEditor) as React.StatelessComponent<CodeEditorProps>;
