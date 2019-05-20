import * as React from "react";

import { MuiThemeProvider } from "@material-ui/core/styles";

import theme from "../theme";

import { App } from "./app";

const Root: React.StatelessComponent<{}> = () => (
  <MuiThemeProvider theme={theme}>
    <App />
  </MuiThemeProvider>
);

export default Root;
