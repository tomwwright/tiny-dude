import { TinyDudePlusCompiler } from "../../tinydudepluscompiler";

import { branch, branchIfPositive } from "./branch";
import { loadAccumulatorConstant } from "./loadAccumulator";

// IF accumulator >= 0, THEN 1 ELSE 0
export function isPositiveAccumulator(compiler: TinyDudePlusCompiler) {
  const jumpToTrueCase = branchIfPositive(compiler);
  loadAccumulatorConstant(compiler, 0);
  const jumpPastTrueCase = branch(compiler);

  compiler.setPendingFlowLabel(jumpToTrueCase);
  loadAccumulatorConstant(compiler, 1);

  compiler.setPendingFlowLabel(jumpPastTrueCase);
}
