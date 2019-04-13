import { TinyDudePlusCompiler } from "../../tinydudepluscompiler";
import { Mnemonic } from "../../assemblycompiler";
import { AST } from "../types";

export function declareVariable(compiler: TinyDudePlusCompiler, type: AST.Type, identifier: string) {
  const symbol = compiler.getSymbol(identifier);
  if (symbol) {
    throw new Error(`variable already declared: ${identifier}`);
  }
  return compiler.defineVariable(type, identifier);
}
