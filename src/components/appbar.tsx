import * as React from 'react';

import { AppBar, Toolbar, Typography, Button } from 'material-ui';
import { Face as FaceIcon } from 'material-ui-icons';

const TinyDudeAppBar: React.StatelessComponent<{}> = () => (
  <AppBar position="static" style={{ marginBottom: '10px' }}>
    <Toolbar>
      <FaceIcon style={{ paddingRight: '10px' }} />
      <Typography type="headline" color="inherit" style={{ flex: 1 }}>
        Tiny Dude
      </Typography>
      <Button color="contrast">About</Button>
      <Button color="contrast">Help</Button>
    </Toolbar>
  </AppBar>
);

export default TinyDudeAppBar;
