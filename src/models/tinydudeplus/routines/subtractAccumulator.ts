import { TinyDudePlusCompiler } from "../../tinydudepluscompiler";
import { Mnemonic } from "../../assemblycompiler";

export function subtractAccumulator(compiler: TinyDudePlusCompiler, identifier: string) {
  const symbol = compiler.getSymbol(identifier);
  if (!symbol) throw new Error(`variable not defined: ${identifier}`);
  compiler.addAssemblyStatement({
    instruction: Mnemonic.SUB,
    argument: symbol.label
  });
}

export function subtractAccumulatorConstant(compiler: TinyDudePlusCompiler, constant: number) {
  const symbol = compiler.defineConstant(constant);
  compiler.addAssemblyStatement({
    instruction: Mnemonic.SUB,
    argument: symbol.label
  });
}
