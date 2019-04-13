import { TinyDudePlusCompiler } from "../../tinydudepluscompiler";
import { Mnemonic } from "../../assemblycompiler";

export function branch(compiler: TinyDudePlusCompiler, existingLabel: string = null) {
  const label = existingLabel || compiler.allocateFlowLabel();
  compiler.addAssemblyStatement({
    instruction: Mnemonic.BRA,
    argument: label
  });

  return label;
}

export function branchIfPositive(compiler: TinyDudePlusCompiler) {
  const label = compiler.allocateFlowLabel();
  compiler.addAssemblyStatement({
    instruction: Mnemonic.BRP,
    argument: label
  });

  return label;
}

export function branchIfZero(compiler: TinyDudePlusCompiler) {
  const label = compiler.allocateFlowLabel();
  compiler.addAssemblyStatement({
    instruction: Mnemonic.BRZ,
    argument: label
  });

  return label;
}
