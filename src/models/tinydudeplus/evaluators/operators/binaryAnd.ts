import { TinyDudePlusCompiler } from "../../../tinydudepluscompiler";
import { AST } from "../../types";

import { storeAccumulator } from "../../routines/storeAccumulator";
import { subtractAccumulatorConstant } from "../../routines/subtractAccumulator";
import { addAccumulator } from "../../routines/addAccumulator";
import { isZeroAccumulator } from "../../routines/isZeroAccumulator";

export function evaluateBinaryAnd(
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

  // subtract 2, because 1 + 1 = 2
  subtractAccumulatorConstant(compiler, 2);

  // if accumulator == 0, then true else false
  isZeroAccumulator(compiler, binary);
}
