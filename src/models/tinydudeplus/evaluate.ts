import { TinyDudePlusCompiler } from "../tinydudepluscompiler";
import { AST, Evaluate } from "./types";

import { evaluateProgram } from "./evaluators/program";
import { evaluateNumber, evaluateBoolean, evaluateIdentifier } from "./evaluators/term";
import { evaluateUnary } from "./evaluators/unary";
import { evaluateDeclaration } from "./evaluators/declaration";
import { evaluateAssignment } from "./evaluators/assignment";
import { evaluateBrackets } from "./evaluators/brackets";
import { evaluateOut } from "./evaluators/out";
import { evaluateBinary } from "./evaluators/binary";
import { evaluateIf } from "./evaluators/if";
import { evaluateLoop } from "./evaluators/loop";

const evaluations: { [type: string]: Evaluate } = {
  program: evaluateProgram,
  comment: () => {},
  out: evaluateOut,
  declaration: evaluateDeclaration,
  assignment: evaluateAssignment,
  brackets: evaluateBrackets,
  identifier: evaluateIdentifier,
  boolean: evaluateBoolean,
  number: evaluateNumber,
  unary: evaluateUnary,
  binary: evaluateBinary,
  if: evaluateIf,
  loop: evaluateLoop
};

export function evaluate(compiler: TinyDudePlusCompiler, ast: AST.Node) {
  const recurse = (node: AST.Node) => {
    const evaluation = evaluations[node.node];
    if (!evaluation) {
      throw new Error(`unhandled AST node type during compilation: ${node.node}!`);
    }

    try {
      evaluation(compiler, node, recurse);
    } catch (e) {
      const error = e as Error;
      compiler.error(node, error.message);
    }
  };

  recurse(ast);
}
