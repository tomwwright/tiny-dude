import * as React from "react";
import { withStyles, WithStyles, Theme } from "@material-ui/core/styles";
import Editor from "react-simple-code-editor";

const styles = withStyles<string>((theme: Theme) => ({
  input: {
    fontFamily: "Courier New"
  },
  border: {
    border: `1px solid ${theme.palette.grey.A400}`,
    padding: "5px"
  },
  borderError: {
    border: `1px solid ${theme.palette.error.dark}`,
    padding: "5px"
  }
}));

type CodeEditorProps = {
  source: string;
  onChange: (value: string) => void;
  hasError?: boolean;
  highlight: (source: string) => string;
};

const CodeEditor: React.StatelessComponent<WithStyles & CodeEditorProps> = ({
  onChange,
  source,
  classes,
  hasError,
  highlight
}) => (
  <div className={hasError ? classes.borderError : classes.border}>
    <Editor
      value={source}
      onValueChange={code => onChange(code)}
      highlight={highlight}
      padding={10}
      className={classes.input}
    />
  </div>
);

export default styles(CodeEditor) as React.StatelessComponent<CodeEditorProps>;
