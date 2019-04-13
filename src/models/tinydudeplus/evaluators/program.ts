import { TinyDudePlusCompiler } from "../../tinydudepluscompiler";
import { AST } from "../types";

import { compileDats } from "../routines/compileDats";

export function evaluateProgram(
  compiler: TinyDudePlusCompiler,
  program: AST.Program,
  evaluate: (node: AST.Node) => void
) {
  for (const statement of program.statements) {
    evaluate(statement);
  }

  compileDats(compiler);
}
