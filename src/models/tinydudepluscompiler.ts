import { parse } from "../grammar/tinydudeplus";
import { AssemblyStatement } from "./assemblycompiler";
import { AST } from "./tinydudeplus/types";
import { evaluate } from "./tinydudeplus/evaluate";

export class TinyDudePlusCompiler {
  private symbols: { [symbol: string]: { label: string; type: AST.Type | "const" | "register" } } = {};
  private assembly: AssemblyStatement[] = [];
  private errors: string[] = [];

  private pendingFlowLabel: string = null;
  private flowLabelCount = 1;

  private registers: { label: string; isFree: boolean }[] = [];

  constructor() {}

  private get symbolsCount() {
    return Object.keys(this.symbols).length;
  }

  getSymbol(symbol: string) {
    return this.symbols[symbol];
  }

  getSymbolForConstant(value: number) {
    return this.getSymbol(value.toString());
  }

  getSymbols() {
    return Object.keys(this.symbols).map(key => ({
      key,
      ...this.symbols[key]
    }));
  }

  defineConstant(value: number) {
    let symbol = this.getSymbolForConstant(value);
    if (!symbol) {
      symbol = this.symbols[value.toString()] = {
        type: "const",
        label: `CONST${value.toString()}`
      };
    }
    return symbol;
  }

  defineVariable(type: AST.Type, identifier: string) {
    let symbol = this.getSymbol(identifier);
    if (!symbol) {
      symbol = this.symbols[identifier] = {
        type: type,
        label: `VAR${this.symbolsCount + 1}`
      };
    }

    return symbol;
  }

  allocateFlowLabel() {
    const label = `FLOW${this.flowLabelCount}`;
    this.flowLabelCount++;
    return label;
  }

  setPendingFlowLabel(label: string) {
    if (this.pendingFlowLabel) {
      this.errors.push(`overriding pending flow control label: ${this.pendingFlowLabel}!`);
    }
    this.pendingFlowLabel = label;
    return this.pendingFlowLabel;
  }

  get registerLabels() {
    return this.registers.map(register => register.label);
  }

  allocateRegister() {
    let register = this.registers.find(register => register.isFree);
    if (!register) {
      register = {
        label: `REG${this.registers.length + 1}`,
        isFree: false
      };
      this.symbols[register.label] = {
        label: register.label,
        type: "register"
      };
      this.registers.push(register);
    }
    register.isFree = false;

    return register.label;
  }

  freeRegister(label: string) {
    const register = this.registers.find(register => register.label == label);
    register.isFree = true;
  }

  addAssemblyStatement(statement: Partial<AssemblyStatement>) {
    if (statement.label && this.pendingFlowLabel) {
      throw new Error(
        `conflicting statement label and pending flow control label: ${statement.label} and ${this.pendingFlowLabel}!`
      );
    }

    this.assembly.push({
      line: this.assembly.length + 1,
      label: statement.label || this.pendingFlowLabel,
      instruction: statement.instruction,
      argument: statement.argument
    });
    this.pendingFlowLabel = null;
  }

  error(error: string) {
    this.errors.push(error);
  }

  static compileAST(compiler: TinyDudePlusCompiler, ast: AST.Program) {
    evaluate(compiler, ast);

    if (compiler.assembly.length > 100) {
      compiler.errors.push(`compiled to ${compiler.assembly.length} opcodes!`);
    }

    return {
      assembly: compiler.assembly,
      errors: compiler.errors
    };
  }

  static compile(source: string) {
    const compiler = new TinyDudePlusCompiler();

    const ast: AST.Program = parse(source) as AST.Program;

    return TinyDudePlusCompiler.compileAST(compiler, ast);
  }
}
