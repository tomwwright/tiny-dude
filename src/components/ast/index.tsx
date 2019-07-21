import * as React from "react";

import { ListItemIcon, ListItem, ListItemText } from "@material-ui/core";

import { ASTNodeIcon } from "./icon";

import { AST } from "../../models/tinydudeplus/types";
import { NestedList } from "../nestedlist";

type ASTNodeProps = {
  node: AST.Node;
  onHover: (node: AST.Node) => void;
  onUnhover: (node: AST.Node) => void;
};

export const ASTNode: React.StatelessComponent<ASTNodeProps> = ({ node, onHover, onUnhover }) => {
  const nodeChildren = children(node);

  if (nodeChildren.length > 0) {
    return (
      <NestedList
        text={node.node}
        icon={() => <ASTNodeIcon node={node} />}
        onHover={() => onHover(node)}
        onUnhover={() => onUnhover(node)}
      >
        {nodeChildren.map((child, i) => (
          <ASTNode key={i} node={child} onHover={onHover} onUnhover={onUnhover} />
        ))}
      </NestedList>
    );
  } else {
    return (
      <ListItem onMouseEnter={() => onHover(node)} onMouseLeave={() => onUnhover(node)}>
        <ListItemIcon>
          <ASTNodeIcon node={node} />
        </ListItemIcon>
        <ListItemText inset primary={node.node} />
      </ListItem>
    );
  }
};

const children = (node: AST.Node): AST.Node[] => {
  switch (node.node) {
    case "program":
      return node.statements;
    case "if":
    case "loop":
      return [node.expression, node.statements].flat();
    case "binary":
      return [node.left, node.right];
    case "unary":
    case "out":
    case "brackets":
      return [node.expression];
    case "assignment":
      return [node.identifier, node.expression];
    case "declaration":
      return [node.declaration];
    case "identifier":
    case "boolean":
    case "number":
      return [];
  }
};
