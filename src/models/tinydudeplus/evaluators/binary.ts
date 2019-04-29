import { TinyDudePlusCompiler } from "../../tinydudepluscompiler";
import { AST } from "../types";

import { evaluateBinaryAdd } from "./operators/binaryAdd";
import { evaluateBinarySubtract } from "./operators/binarySubtract";
import { evaluateBinaryGreaterThan } from "./operators/binaryGreaterThan";
import { evaluateBinaryEquals } from "./operators/binaryEquals";

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
    case "==":
      evaluateBinaryEquals(compiler, binary, evaluate);
      break;
    case ">":
      evaluateBinaryGreaterThan(compiler, binary, evaluate);
      break;
    case "<":
      const switchedBinary: AST.BinaryExpression = {
        ...binary,
        left: binary.right,
        right: binary.left,
        operator: ">"
      };
      evaluateBinaryGreaterThan(compiler, switchedBinary, evaluate);
      break;
    default:
      throw new Error(`unhandled binary expression: ${binary.operator}`);
  }
}
