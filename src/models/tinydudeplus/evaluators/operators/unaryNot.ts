import { TinyDudePlusCompiler } from "../../../tinydudepluscompiler";
import { AST } from "../../types";

import { notAccumulator } from "../../routines/notAccumulator";

export function evaluateUnaryNot(
  compiler: TinyDudePlusCompiler,
  node: AST.UnaryExpression,
  evaluate: (node: AST.Node) => void
) {
  evaluate(node.expression);
  notAccumulator(compiler);
}
