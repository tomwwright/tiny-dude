import { TinyDudePlusCompiler } from "../../tinydudepluscompiler";

import { branch, branchIfZero } from "./branch";
import { loadAccumulatorConstant } from "./loadAccumulator";

export function notAccumulator(compiler: TinyDudePlusCompiler) {
  const jumpIfZeroLabel = branchIfZero(compiler);

  loadAccumulatorConstant(compiler, 0);

  const jumpIfNotZeroLabel = branch(compiler);

  compiler.setPendingFlowLabel(jumpIfZeroLabel);
  loadAccumulatorConstant(compiler, 1);

  compiler.setPendingFlowLabel(jumpIfNotZeroLabel);
}