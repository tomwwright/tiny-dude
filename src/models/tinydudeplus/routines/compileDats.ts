import { TinyDudePlusCompiler } from "../../tinydudepluscompiler";
import { Mnemonic } from "../../assemblycompiler";

export function compileDats(compiler: TinyDudePlusCompiler) {
  const symbols = compiler.getSymbols().sort((a, b) => a.label.localeCompare(b.label));

  for (const symbol of symbols) {
    compiler.addAssemblyStatement({
      instruction: Mnemonic.DAT,
      label: symbol.label,
      argument: symbol.type == "const" ? symbol.key : "0"
    });
  }
}
