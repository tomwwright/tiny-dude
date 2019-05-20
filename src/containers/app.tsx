import * as React from "react";
import { inject, observer } from "mobx-react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import { AssemblyView } from "./assemblyview";
import { PlusView } from "./tinydudeplusview";

import AppBar from "../components/appbar";
import { Footer, FooterSpacer } from "../components/footer";

export const App: React.StatelessComponent = props => (
  <Router>
    <div style={{ minHeight: "100%", maxWidth: "100%" }}>
      <AppBar githubUrl="https://github.com/tomwwright/tiny-dude" />

      <Route path="/" exact component={AssemblyView} />
      <Route path="/plus" component={PlusView} />

      <FooterSpacer />
    </div>

    <Footer />
  </Router>
);
