import { TinyDudePlusCompiler } from "../../tinydudepluscompiler";
import { Mnemonic } from "../../assemblycompiler";

export function storeAccumulator(compiler: TinyDudePlusCompiler, identifier: string) {
  const symbol = compiler.getSymbol(identifier);
  if (!symbol) throw new Error(`variable not defined: ${identifier}`);
  compiler.addAssemblyStatement({
    instruction: Mnemonic.STA,
    argument: symbol.label
  });
}
