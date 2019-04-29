import { TinyDudePlusCompiler } from "../../../tinydudepluscompiler";
import { AST } from "../../types";

import { storeAccumulator } from "../../routines/storeAccumulator";
import { subtractAccumulator } from "../../routines/subtractAccumulator";
import { notAccumulator } from "../../routines/notAccumulator";

export function evaluateBinaryEquals(
  compiler: TinyDudePlusCompiler,
  binary: AST.BinaryExpression,
  evaluate: (node: AST.Node) => void
) {
  const registerLeft = compiler.allocateRegister();
  evaluate(binary.left);
  storeAccumulator(compiler, registerLeft);

  evaluate(binary.right);

  subtractAccumulator(compiler, registerLeft);
  compiler.freeRegister(registerLeft);

  notAccumulator(compiler);
}
