import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  overrides: {
    MuiPaper: {
      root: {
        padding: "10px"
      }
    }
  }
});

export default theme;
