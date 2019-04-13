import { TinyDudePlusCompiler } from "../../tinydudepluscompiler";
import { Mnemonic } from "../../assemblycompiler";

export function outputAccumulator(compiler: TinyDudePlusCompiler) {
  compiler.addAssemblyStatement({
    instruction: Mnemonic.OUT
  });
}
