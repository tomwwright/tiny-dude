import { TinyDudePlusCompiler } from "../../tinydudepluscompiler";
import { AST } from "../types";

import { storeAccumulator } from "../routines/storeAccumulator";

export function evaluateAssignment(
  compiler: TinyDudePlusCompiler,
  assignment: AST.Assignment,
  evaluate: (node: AST.Node) => void
) {
  evaluate(assignment.expression);
  storeAccumulator(compiler, assignment.identifier.value);
}
