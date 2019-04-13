import { TinyDudePlusCompiler } from "../../tinydudepluscompiler";
import { AST } from "../types";

import { evaluateBinaryAdd } from "./operators/binaryAdd";
import { evaluateBinarySubtract } from "./operators/binarySubtract";

export function evaluateBinary(
  compiler: TinyDudePlusCompiler,
  binary: AST.BinaryExpression,
  evaluate: (node: AST.Node) => void
) {
  switch (binary.operator) {
    case "+":
      evaluateBinaryAdd(compiler, binary, evaluate);
      break;
    case "-":
      evaluateBinarySubtract(compiler, binary, evaluate);
      break;
    default:
      throw new Error(`unhandled binary expression: ${binary.operator}`);
  }
}
