import { TinyDudePlusCompiler } from "../../../tinydudepluscompiler";
import { AST } from "../../types";

import { isZeroAccumulator } from "../../routines/isZeroAccumulator";

export function evaluateUnaryNot(
  compiler: TinyDudePlusCompiler,
  node: AST.UnaryExpression,
  evaluate: (node: AST.Node) => void
) {
  evaluate(node.expression);
  isZeroAccumulator(compiler, node);
}
