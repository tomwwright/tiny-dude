import { TinyDudePlusCompiler } from "../../tinydudepluscompiler";
import { AST } from "../types";

import { declareVariable } from "../routines/declareVariable";
import { storeAccumulator } from "../routines/storeAccumulator";

export function evaluateDeclaration(
  compiler: TinyDudePlusCompiler,
  declaration: AST.Declaration,
  evaluate: (node: AST.Node) => void
) {
  declareVariable(
    compiler,
    declaration.type,
    declaration.declaration.node == "identifier"
      ? declaration.declaration.value
      : declaration.declaration.identifier.value
  );

  if (declaration.declaration.node == "assignment") {
    evaluate(declaration.declaration);
  }
}
