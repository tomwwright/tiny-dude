import { TinyDudePlusCompiler } from "../../../tinydudepluscompiler";
import { AST } from "../../types";

import { storeAccumulator } from "../../routines/storeAccumulator";
import { subtractAccumulator } from "../../routines/subtractAccumulator";

export function evaluateBinarySubtract(
  compiler: TinyDudePlusCompiler,
  binary: AST.BinaryExpression,
  evaluate: (node: AST.Node) => void
) {
  const registerRight = compiler.allocateRegister();
  evaluate(binary.right);
  storeAccumulator(compiler, registerRight);

  evaluate(binary.left);

  subtractAccumulator(compiler, registerRight);

  compiler.freeRegister(registerRight);
}
