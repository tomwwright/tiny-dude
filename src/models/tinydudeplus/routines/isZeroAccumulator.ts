import { TinyDudePlusCompiler } from "../../tinydudepluscompiler";

import { branch, branchIfZero } from "./branch";
import { loadAccumulatorConstant } from "./loadAccumulator";

// IF accumulator == 0, THEN 1 ELSE 0
export function isZeroAccumulator(compiler: TinyDudePlusCompiler) {
  const jumpToTrueCase = branchIfZero(compiler);
  loadAccumulatorConstant(compiler, 0);
  const jumpPastTrueCase = branch(compiler);

  compiler.setPendingFlowLabel(jumpToTrueCase);
  loadAccumulatorConstant(compiler, 1);

  compiler.setPendingFlowLabel(jumpPastTrueCase);
}
