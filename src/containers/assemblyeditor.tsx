import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { List, ListItem, ListItemIcon, ListItemText, Button, Typography, Grid } from 'material-ui';
import { WithStyles, withStyles, Theme } from 'material-ui/styles';
import { Error as ErrorIcon } from 'material-ui-icons';

import CodeEditor from 'components/codeeditor';
import Scrollable from 'components/scrollable';
import AssemblyStore from 'stores/assembly';
import ComputeStore from 'stores/compute';

const style = withStyles<string>((theme: Theme) => ({
  error: {
    backgroundColor: theme.palette.error.A100,
  },
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
    <Grid container justify="space-between" alignItems="center" style={{ marginTop: '5px' }}>
      <Grid item>
        {assemblyStore.compileErrors.length > 0 ? (
          <Typography className={classes.errorText}>
            Found {assemblyStore.compileErrors.length} compile errors
          </Typography>
        ) : (
          <Typography>Compiled! </Typography>
        )}
      </Grid>
      <Grid item>
        <Button
          raised
          color="primary"
          disabled={assemblyStore.program.length == 0}
          onClick={() => computeStore.init(assemblyStore.program)}
        >
          Load Program
        </Button>
      </Grid>
    </Grid>

    <Scrollable height={200}>
      <List dense={true}>
        {assemblyStore.compileErrors.map((error, i) => (
          <ListItem key={i} className={classes.error}>
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
  </div>
);

export default inject('computeStore', 'assemblyStore')(style(observer(AssemblyEditor)));
