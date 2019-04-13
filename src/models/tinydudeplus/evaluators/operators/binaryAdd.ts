import { TinyDudePlusCompiler } from "../../../tinydudepluscompiler";
import { AST } from "../../types";

import { storeAccumulator } from "../../routines/storeAccumulator";
import { addAccumulator } from "../../routines/addAccumulator";

export function evaluateBinaryAdd(
  compiler: TinyDudePlusCompiler,
  binary: AST.BinaryExpression,
  evaluate: (node: AST.Node) => void
) {
  const registerLeft = compiler.allocateRegister();
  evaluate(binary.left);
  storeAccumulator(compiler, registerLeft);

  evaluate(binary.right);

  addAccumulator(compiler, registerLeft);

  compiler.freeRegister(registerLeft);
}
