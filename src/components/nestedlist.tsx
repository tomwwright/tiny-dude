import * as React from "react";
import { ExpandLess as ExpandLessIcon, ExpandMore as ExpandMoreIcon } from "@material-ui/icons";

import { Collapse, ListItem, ListItemText, ListItemIcon, List } from "@material-ui/core";

type NestedListProps = {
  icon: () => React.ReactElement;
  text: string;
  onHover?: () => void;
  onUnhover?: () => void;
};

type NestedListState = {
  open: boolean;
};

export class NestedList extends React.Component<NestedListProps, NestedListState> {
  state = {
    open: false
  };

  handleClick = () => {
    this.setState(state => ({ open: !state.open }));
  };

  render() {
    return (
      <div>
        <ListItem
          button
          onClick={this.handleClick}
          onMouseEnter={() => this.props.onHover()}
          onMouseLeave={() => this.props.onUnhover()}
        >
          <ListItemIcon>{this.props.icon()}</ListItemIcon>
          <ListItemText inset primary={this.props.text} />
          {this.state.open ? <ExpandMoreIcon /> : <ExpandLessIcon />}
        </ListItem>
        <Collapse in={this.state.open} timeout="auto" style={{ paddingLeft: "16px" }} unmountOnExit>
          <List disablePadding>{this.props.children}</List>
        </Collapse>
      </div>
    );
  }
}
