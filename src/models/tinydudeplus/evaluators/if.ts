import { TinyDudePlusCompiler } from "../../tinydudepluscompiler";
import { AST } from "../types";

import { subtractAccumulatorConstant } from "../routines/subtractAccumulator";
import { branchIfPositive } from "../routines/branch";

export function evaluateIf(compiler: TinyDudePlusCompiler, block: AST.Block, evaluate: (node: AST.Node) => void) {
  evaluate(block.expression);
  subtractAccumulatorConstant(compiler, 1);
  const skipBlockFlowLabel = branchIfPositive(compiler);
  for (const statement of block.statements) {
    evaluate(statement);
  }
  compiler.setPendingFlowLabel(skipBlockFlowLabel);
}
