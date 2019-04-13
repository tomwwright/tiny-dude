import { TinyDudePlusCompiler } from "../../tinydudepluscompiler";
import { AST } from "../types";

export function evaluateBrackets(
  compiler: TinyDudePlusCompiler,
  brackets: AST.BracketsExpression,
  evaluate: (node: AST.Node) => void
) {
  evaluate(brackets.expression);
}
