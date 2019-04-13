import { TinyDudePlusCompiler } from "../../tinydudepluscompiler";

import { loadAccumulatorConstant, loadAccumulator } from "../routines/loadAccumulator";
import { AST } from "../types";

export function evaluateNumber(compiler: TinyDudePlusCompiler, number: AST.NumberTerm) {
  loadAccumulatorConstant(compiler, number.value);
}

export function evaluateBoolean(compiler: TinyDudePlusCompiler, boolean: AST.BooleanTerm) {
  loadAccumulatorConstant(compiler, boolean.value ? 1 : 0);
}

export function evaluateIdentifier(compiler: TinyDudePlusCompiler, identifier: AST.IdentifierTerm) {
  loadAccumulator(compiler, identifier.value);
}
