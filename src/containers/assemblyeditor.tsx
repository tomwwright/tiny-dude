import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { List, ListItem, ListItemIcon, ListItemText, Button, Typography, Grid } from 'material-ui';
import { WithStyles, withStyles, Theme } from 'material-ui/styles';
import { Error as ErrorIcon, Check as CheckIcon } from 'material-ui-icons';

import CodeEditor from 'components/codeeditor';
import Scrollable from 'components/scrollable';
import AssemblyStore from 'stores/assembly';
import ComputeStore from 'stores/compute';

const style = withStyles<string>((theme: Theme) => ({
  errorText: {
    color: theme.palette.error.A400,
  },
}));

type AssemblyEditorProps = {
  computeStore?: ComputeStore;
  assemblyStore?: AssemblyStore;
};

const AssemblyEditor: React.StatelessComponent<WithStyles & AssemblyEditorProps> = ({
  computeStore,
  assemblyStore,
  classes,
}) => (
  <div>
    <CodeEditor hasError={assemblyStore.compileErrors.length > 0} onChange={code => assemblyStore.compile(code)} />
    {assemblyStore.compileErrors.length == 0 ? (
      <ListItem>
        <ListItemIcon>
          <CheckIcon />
        </ListItemIcon>
        <ListItemText primary="Compiled!" secondary={`${assemblyStore.program.length} opcodes`} />
      </ListItem>
    ) : (
      <Scrollable height={200}>
        <List dense={true}>
          {assemblyStore.compileErrors.map((error, i) => (
            <ListItem key={i}>
              <ListItemIcon>
                <ErrorIcon className={classes.errorText} />
              </ListItemIcon>
              <ListItemText
                classes={{ textDense: classes.errorText }}
                primary={error.message}
                secondary={'Line ' + error.line}
              />
            </ListItem>
          ))}
        </List>
      </Scrollable>
    )}
  </div>
);

export default inject('computeStore', 'assemblyStore')(style(observer(AssemblyEditor)));
