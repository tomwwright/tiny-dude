import { TinyDudePlusCompiler } from "../../tinydudepluscompiler";
import { AST } from "../types";

import { subtractAccumulatorConstant } from "../routines/subtractAccumulator";
import { branchIfPositive, branch } from "../routines/branch";

export function evaluateLoop(compiler: TinyDudePlusCompiler, block: AST.Block, evaluate: (node: AST.Node) => void) {
  const jumpBackToExpressionEvaluationLabel = compiler.allocateFlowLabel();
  compiler.setPendingFlowLabel(jumpBackToExpressionEvaluationLabel);
  evaluate(block.expression);
  subtractAccumulatorConstant(compiler, 1);
  const skipBlockFlowLabel = branchIfPositive(compiler);
  for (const statement of block.statements) {
    evaluate(statement);
  }
  branch(compiler, jumpBackToExpressionEvaluationLabel);
  compiler.setPendingFlowLabel(skipBlockFlowLabel);
}
