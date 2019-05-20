import * as React from "react";
import { Typography } from "@material-ui/core";

export const Footer: React.StatelessComponent = () => (
  <div
    style={{
      marginTop: "-50px"
    }}
  >
    <Typography variant="caption" component="p" style={{ textAlign: "center" }}>
      TinyDude by Tom Wright{" "}
    </Typography>
    <Typography variant="caption" component="p" style={{ textAlign: "center" }}>
      <a style={{ color: "inherit" }} href="https://tomwwright.com">
        tomwwright.com
      </a>
    </Typography>
  </div>
);

export const FooterSpacer: React.StatelessComponent = () => <div style={{ height: "70px" }} />;
