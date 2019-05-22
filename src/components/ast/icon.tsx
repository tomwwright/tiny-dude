import * as React from "react";

import {
  Repeat as RepeatIcon,
  List as ListIcon,
  BubbleChart as BubbleChartIcon,
  FontDownload as FontDownloadIcon,
  MoveToInbox as MoveToInboxIcon,
  Print as PrintIcon
} from "@material-ui/icons";

import { AST } from "../../models/tinydudeplus/types";

type ASTNodeIconProps = {
  node: AST.Node;
};

export const ASTNodeIcon: React.StatelessComponent<ASTNodeIconProps> = ({ node }) => {
  switch (node.node) {
    case "program":
      return <ListIcon />;
    case "if":
    case "loop":
      return <RepeatIcon />;
    case "out":
      return <PrintIcon />;
    case "binary":
    case "unary":
    case "brackets":
      return <BubbleChartIcon />;
    case "assignment":
    case "declaration":
      return <MoveToInboxIcon />;
    case "identifier":
    case "boolean":
    case "number":
      return <FontDownloadIcon />;
  }
};
