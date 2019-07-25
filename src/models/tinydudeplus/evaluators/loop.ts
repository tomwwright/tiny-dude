import { TinyDudePlusCompiler } from "../../tinydudepluscompiler";
import { AST } from "../types";

import { subtractAccumulatorConstant } from "../routines/subtractAccumulator";
import { branch, branchIfZero } from "../routines/branch";

export function evaluateLoop(compiler: TinyDudePlusCompiler, block: AST.Block, evaluate: (node: AST.Node) => void) {
  const jumpBackToExpressionEvaluationLabel = compiler.allocateFlowLabel();
  compiler.setPendingFlowLabel(block, jumpBackToExpressionEvaluationLabel);
  evaluate(block.expression);
  const skipBlockFlowLabel = branchIfZero(compiler);
  for (const statement of block.statements) {
    evaluate(statement);
  }
  branch(compiler, jumpBackToExpressionEvaluationLabel);
  compiler.setPendingFlowLabel(block, skipBlockFlowLabel);
}
