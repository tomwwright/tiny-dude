import { TinyDudePlusCompiler } from "../../tinydudepluscompiler";
import { AST } from "../types";

import { evaluateUnaryNot } from "./operators/unaryNot";

export function evaluateUnary(
  compiler: TinyDudePlusCompiler,
  unary: AST.UnaryExpression,
  evaluate: (node: AST.Node) => void
) {
  switch (unary.operator) {
    case "not":
      evaluateUnaryNot(compiler, unary, evaluate);
      break;
    default:
      throw new Error(`Compile Error: Unhandled unary operator: ${unary.operator}`);
  }
}
