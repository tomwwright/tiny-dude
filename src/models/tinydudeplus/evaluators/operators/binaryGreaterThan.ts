import { TinyDudePlusCompiler } from "../../../tinydudepluscompiler";
import { AST } from "../../types";

import { loadAccumulatorConstant } from "../../routines/loadAccumulator";
import { storeAccumulator } from "../../routines/storeAccumulator";
import { subtractAccumulator } from "../../routines/subtractAccumulator";
import { branch, branchIfPositive } from "../../routines/branch";

export function evaluateBinaryGreaterThan(
  compiler: TinyDudePlusCompiler,
  binary: AST.BinaryExpression,
  evaluate: (node: AST.Node) => void
) {
  // evaluate right, store in a register
  const registerRight = compiler.allocateRegister();
  evaluate(binary.right);
  storeAccumulator(compiler, registerRight);

  // evaluate left, subtract right from result
  evaluate(binary.left);
  subtractAccumulator(compiler, registerRight);
  compiler.freeRegister(registerRight);

  // assume false
  loadAccumulatorConstant(compiler, 0);

  // if accumulator is >= 0, then left cannot be greater than right
  const jumpPastTrueCase = branchIfPositive(compiler);
  loadAccumulatorConstant(compiler, 1);
  compiler.setPendingFlowLabel(jumpPastTrueCase);
}
