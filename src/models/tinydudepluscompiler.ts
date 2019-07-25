import * as TinyDudePlus from "../grammar/tinydudeplus";
import { AssemblyStatement } from "./assemblycompiler";
import { AST } from "./tinydudeplus/types";
import { evaluate } from "./tinydudeplus/evaluate";

type CompileError = {
  message: string;
  line?: number;
};

export class TinyDudePlusCompiler {
  private symbols: { [symbol: string]: { label: string; type: AST.Type | "const" | "register" } } = {};
  private assembly: AssemblyStatement[] = [];
  private errors: CompileError[] = [];

  private pendingFlowLabel: string = null;
  private flowLabelCount = 1;

  private registers: { label: string; isFree: boolean }[] = [];

  private get symbolsCount() {
    return Object.values(this.symbols).filter(symbol => symbol.label.startsWith("VAR")).length;
  }

  getAssemblySource() {
    const longestLabelLength = this.assembly
      .filter(statement => statement.label != null)
      .map(statement => statement.label.length)
      .sort((a, b) => b - a)[0];
    return this.assembly
      .map(
        statement =>
          `${(statement.label || "").padEnd(
            longestLabelLength
          )} ${statement.instruction.toString()} ${statement.argument || ""}`
      )
      .join("\n");
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

  setPendingFlowLabel(node: AST.Node, label: string) {
    if (this.pendingFlowLabel) {
      this.error(node, `overriding pending flow control label: ${this.pendingFlowLabel}!`);
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

  error(node: AST.Node, error: string) {
    this.errors.push({
      message: error,
      line: node.location ? node.location.start.line : null
    });
  }

  static compileAST(compiler: TinyDudePlusCompiler, ast: AST.Program) {
    evaluate(compiler, ast);

    return {
      ast: ast,
      assembly: compiler.assembly,
      source: compiler.getAssemblySource(),
      errors: compiler.errors
    };
  }

  static compile(source: string) {
    const compiler = new TinyDudePlusCompiler();

    let ast: AST.Program;

    try {
      ast = TinyDudePlus.parse(source) as AST.Program;
    } catch (e) {
      if (e.name == "SyntaxError") {
        const syntaxError = e as AST.SyntaxError;

        console.error(syntaxError);

        return {
          errors: [
            {
              message: "Syntax Error: " + syntaxError.message,
              line: syntaxError.location.start.line
            }
          ],
          ast: null,
          assembly: null,
          source: null
        };
      }
      throw e;
    }

    return TinyDudePlusCompiler.compileAST(compiler, ast);
  }
}
