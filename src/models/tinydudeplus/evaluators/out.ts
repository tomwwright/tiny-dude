import { TinyDudePlusCompiler } from "../../tinydudepluscompiler";
import { AST } from "../types";

import { outputAccumulator } from "../routines/outputAccumulator";

export function evaluateOut(compiler: TinyDudePlusCompiler, out: AST.Out, evaluate: (node: AST.Node) => void) {
  evaluate(out.expression);
  outputAccumulator(compiler);
}
