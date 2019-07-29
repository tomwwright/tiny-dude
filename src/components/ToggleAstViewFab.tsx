import { withRouter, RouteComponentProps } from "react-router-dom";
import * as React from "react";
import { Fab } from "@material-ui/core";
import { BubbleChart as BubbleChartIcon, ChevronLeft as ChevronLeftIcon } from "@material-ui/icons";

import { AdapterLink } from "./adapterlink";

const ToggleAstViewFabComponent: React.StatelessComponent<RouteComponentProps> = props => {
  if (props.location.pathname == "/ast") return <BackFromAstViewFab />;
  else return <AstViewFab />;
};

const AstViewFab: React.StatelessComponent<{}> = () => (
  <Fab
    aria-label={"View TinyDude+ AST"}
    variant="extended"
    color="secondary"
    size="small"
    style={{ position: "absolute", bottom: "8px", right: "8px" }}
    component={props => <AdapterLink {...props} to="/ast" />}
  >
    <BubbleChartIcon /> AST
  </Fab>
);

const BackFromAstViewFab: React.StatelessComponent<{}> = () => (
  <Fab
    aria-label={"Back to main TinyDude view"}
    variant="extended"
    color="primary"
    size="small"
    style={{ position: "absolute", bottom: "8px", right: "8px" }}
    component={props => <AdapterLink {...props} to="/" />}
  >
    <ChevronLeftIcon /> BACK
  </Fab>
);

export const ToggleAstViewFab = withRouter(ToggleAstViewFabComponent);
