import { TinyDudePlusCompiler } from "../../../tinydudepluscompiler";
import { AST } from "../../types";

import { storeAccumulator } from "../../routines/storeAccumulator";
import { subtractAccumulatorConstant } from "../../routines/subtractAccumulator";
import { addAccumulator } from "../../routines/addAccumulator";
import { isPositiveAccumulator } from "../../routines/isPositiveAccumulator";

export function evaluateBinaryOr(
  compiler: TinyDudePlusCompiler,
  binary: AST.BinaryExpression,
  evaluate: (node: AST.Node) => void
) {
  // evaluate right, store in a register
  const registerRight = compiler.allocateRegister();
  evaluate(binary.right);
  storeAccumulator(compiler, registerRight);

  // evaluate left, add right from result
  evaluate(binary.left);
  addAccumulator(compiler, registerRight);
  compiler.freeRegister(registerRight);

  subtractAccumulatorConstant(compiler, 1);

  isPositiveAccumulator(compiler);
}
