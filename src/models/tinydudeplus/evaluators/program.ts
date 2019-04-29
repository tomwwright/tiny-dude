import { TinyDudePlusCompiler } from "../../tinydudepluscompiler";
import { AST } from "../types";

import { compileDats } from "../routines/compileDats";
import { Mnemonic } from "../../assemblycompiler";

export function evaluateProgram(
  compiler: TinyDudePlusCompiler,
  program: AST.Program,
  evaluate: (node: AST.Node) => void
) {
  for (const statement of program.statements) {
    evaluate(statement);
  }

  compiler.addAssemblyStatement({
    instruction: Mnemonic.HLT
  });

  compileDats(compiler);
}
