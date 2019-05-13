import { TinyDudePlusCompiler } from "../../tinydudepluscompiler";
import { AST } from "../types";

import { evaluateBinaryAdd } from "./operators/binaryAdd";
import { evaluateBinarySubtract } from "./operators/binarySubtract";
import { evaluateBinaryGreaterThanEquals } from "./operators/binaryGreaterThanEquals";
import { evaluateBinaryEquals } from "./operators/binaryEquals";
import { evaluateBinaryAnd } from "./operators/binaryAnd";
import { evaluateBinaryOr } from "./operators/binaryOr";

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
    case ">=":
      evaluateBinaryGreaterThanEquals(compiler, binary, evaluate);
      break;
    case "<=":
      const switchedBinary: AST.BinaryExpression = {
        ...binary,
        left: binary.right,
        right: binary.left,
        operator: ">="
      };
      evaluateBinaryGreaterThanEquals(compiler, switchedBinary, evaluate);
      break;
    case "and":
      evaluateBinaryAnd(compiler, binary, evaluate);
      break;
    case "or":
      evaluateBinaryOr(compiler, binary, evaluate);
      break;
    default:
      throw new Error(`unhandled binary expression: ${binary.operator}`);
  }
}
