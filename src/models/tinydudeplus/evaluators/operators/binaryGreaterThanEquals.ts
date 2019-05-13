import { TinyDudePlusCompiler } from "../../../tinydudepluscompiler";
import { AST } from "../../types";

import { storeAccumulator } from "../../routines/storeAccumulator";
import { subtractAccumulator } from "../../routines/subtractAccumulator";
import { isPositiveAccumulator } from "../../routines/isPositiveAccumulator";

export function evaluateBinaryGreaterThanEquals(
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

  isPositiveAccumulator(compiler);
}
