import { TinyDudePlusCompiler } from "../../tinydudepluscompiler";
import { AST } from "../types";

import { subtractAccumulatorConstant } from "../routines/subtractAccumulator";
import { branchIfZero } from "../routines/branch";

export function evaluateIf(compiler: TinyDudePlusCompiler, block: AST.Block, evaluate: (node: AST.Node) => void) {
  evaluate(block.expression);
  const skipBlockFlowLabel = branchIfZero(compiler);
  for (const statement of block.statements) {
    evaluate(statement);
  }
  compiler.setPendingFlowLabel(block, skipBlockFlowLabel);
}
