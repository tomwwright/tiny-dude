import * as React from 'react';

import { MuiThemeProvider } from 'material-ui/styles';

import theme from 'theme';

import App from 'containers/app';

const Root: React.StatelessComponent<{}> = () => (
  <MuiThemeProvider theme={theme}>
    <App />
  </MuiThemeProvider>
);

export default Root;
