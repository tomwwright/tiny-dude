import * as React from "react";

import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";
import { Face as FaceIcon, Code as CodeIcon, InfoOutlined as InfoIcon } from "@material-ui/icons";

type TinyDudeAppBarProps = {
  githubUrl: string;
};

const TinyDudeAppBar: React.StatelessComponent<TinyDudeAppBarProps> = props => (
  <AppBar position="static" style={{ marginBottom: "10px" }}>
    <Toolbar>
      <FaceIcon style={{ paddingRight: "10px" }} />
      <Typography variant="headline" color="inherit" style={{ flex: 1 }}>
        Tiny Dude
      </Typography>
      <Button target="about:blank" href={props.githubUrl} color="secondary">
        <CodeIcon style={{ paddingRight: "10px" }} /> GitHub
      </Button>
    </Toolbar>
  </AppBar>
);

export default TinyDudeAppBar;
