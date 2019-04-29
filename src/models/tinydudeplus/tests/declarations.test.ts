import { TinyDudePlusCompiler } from "../../tinydudepluscompiler";
import { AST } from "../types";
import { Mnemonic } from "../../assemblycompiler";

describe("compiles declaring", () => {
  it("boolean variable declaration", () => {
    const ast: AST.Program = {
      node: "program",
      statements: [
        {
          node: "declaration",
          type: "bool",
          declaration: {
            node: "identifier",
            value: "b"
          }
        }
      ]
    };
    const compiler = new TinyDudePlusCompiler();
    let { assembly, errors } = TinyDudePlusCompiler.compileAST(compiler, ast);

    expect(assembly).toEqual([
      {
        line: 1,
        label: null,
        instruction: "HLT",
        argument: undefined
      },
      {
        line: 2,
        label: "VAR1",
        instruction: Mnemonic.DAT,
        argument: "0"
      }
    ]);
    expect(errors).toEqual([]);
  });

  it("number variable declaration", () => {
    const ast: AST.Program = {
      node: "program",
      statements: [
        {
          node: "declaration",
          type: "num",
          declaration: {
            node: "identifier",
            value: "x"
          }
        }
      ]
    };

    const compiler = new TinyDudePlusCompiler();
    let { assembly, errors } = TinyDudePlusCompiler.compileAST(compiler, ast);

    expect(assembly).toEqual([
      {
        line: 1,
        label: null,
        instruction: "HLT",
        argument: undefined
      },
      {
        line: 2,
        label: "VAR1",
        instruction: Mnemonic.DAT,
        argument: "0"
      }
    ]);
    expect(errors).toEqual([]);
  });

  it("number variable declaration with constant assignment", () => {
    const ast: AST.Program = {
      node: "program",
      statements: [
        {
          node: "declaration",
          type: "num",
          declaration: {
            node: "assignment",
            identifier: {
              node: "identifier",
              value: "x"
            },
            expression: {
              node: "number",
              value: 3
            }
          }
        }
      ]
    };

    const compiler = new TinyDudePlusCompiler();
    let { assembly, errors } = TinyDudePlusCompiler.compileAST(compiler, ast);

    expect(assembly).toEqual([
      {
        line: 1,
        label: null,
        instruction: Mnemonic.LDA,
        argument: "CONST3"
      },
      {
        line: 2,
        label: null,
        instruction: Mnemonic.STA,
        argument: "VAR1"
      },
      {
        line: 3,
        label: null,
        instruction: "HLT",
        argument: undefined
      },
      {
        line: 4,
        label: "CONST3",
        instruction: Mnemonic.DAT,
        argument: "3"
      },
      {
        line: 5,
        label: "VAR1",
        instruction: Mnemonic.DAT,
        argument: "0"
      }
    ]);
    expect(errors).toEqual([]);
  });

  it("boolean variable declaration with constant assignment", () => {
    const ast: AST.Program = {
      node: "program",
      statements: [
        {
          node: "declaration",
          type: "bool",
          declaration: {
            node: "assignment",
            identifier: {
              node: "identifier",
              value: "b"
            },
            expression: {
              node: "boolean",
              value: true
            }
          }
        }
      ]
    };

    const compiler = new TinyDudePlusCompiler();
    let { assembly, errors } = TinyDudePlusCompiler.compileAST(compiler, ast);

    expect(assembly).toEqual([
      {
        line: 1,
        label: null,
        instruction: Mnemonic.LDA,
        argument: "CONST1"
      },
      {
        line: 2,
        label: null,
        instruction: Mnemonic.STA,
        argument: "VAR1"
      },
      {
        line: 3,
        label: null,
        instruction: "HLT",
        argument: undefined
      },
      {
        line: 4,
        label: "CONST1",
        instruction: Mnemonic.DAT,
        argument: "1"
      },
      {
        line: 5,
        label: "VAR1",
        instruction: Mnemonic.DAT,
        argument: "0"
      }
    ]);
    expect(errors).toEqual([]);
  });

  it("variable declaration with variable assignment", () => {
    const ast: AST.Program = {
      node: "program",
      statements: [
        {
          node: "declaration",
          type: "num",
          declaration: {
            node: "identifier",
            value: "x"
          }
        },
        {
          node: "declaration",
          type: "num",
          declaration: {
            node: "assignment",
            identifier: {
              node: "identifier",
              value: "y"
            },
            expression: {
              node: "identifier",
              value: "x"
            }
          }
        }
      ]
    };

    const compiler = new TinyDudePlusCompiler();
    let { assembly, errors } = TinyDudePlusCompiler.compileAST(compiler, ast);

    expect(assembly).toEqual([
      {
        line: 1,
        label: null,
        instruction: Mnemonic.LDA,
        argument: "VAR1"
      },
      {
        line: 2,
        label: null,
        instruction: Mnemonic.STA,
        argument: "VAR2"
      },
      {
        line: 3,
        label: null,
        instruction: "HLT",
        argument: undefined
      },
      {
        line: 4,
        label: "VAR1",
        instruction: Mnemonic.DAT,
        argument: "0"
      },
      {
        line: 5,
        label: "VAR2",
        instruction: Mnemonic.DAT,
        argument: "0"
      }
    ]);
    expect(errors).toEqual([]);
  });

  it("variable declaration with binary add expression", () => {
    const ast: AST.Program = {
      node: "program",
      statements: [
        {
          node: "declaration",
          type: "num",
          declaration: {
            node: "assignment",
            identifier: {
              node: "identifier",
              value: "x"
            },
            expression: {
              node: "binary",
              operator: "+",
              left: {
                node: "number",
                value: 3
              },
              right: {
                node: "number",
                value: 7
              }
            }
          }
        }
      ]
    };

    const compiler = new TinyDudePlusCompiler();
    let { assembly, errors } = TinyDudePlusCompiler.compileAST(compiler, ast);

    expect(assembly).toEqual([
      {
        line: 1,
        label: null,
        instruction: Mnemonic.LDA,
        argument: "CONST3"
      },
      {
        line: 2,
        label: null,
        instruction: Mnemonic.STA,
        argument: "REG1"
      },

      {
        line: 3,
        label: null,
        instruction: Mnemonic.LDA,
        argument: "CONST7"
      },
      {
        line: 4,
        label: null,
        instruction: Mnemonic.ADD,
        argument: "REG1"
      },
      {
        line: 5,
        label: null,
        instruction: Mnemonic.STA,
        argument: "VAR1"
      },
      {
        line: 6,
        label: null,
        instruction: "HLT",
        argument: undefined
      },
      {
        line: 7,
        label: "CONST3",
        instruction: Mnemonic.DAT,
        argument: "3"
      },
      {
        line: 8,
        label: "CONST7",
        instruction: Mnemonic.DAT,
        argument: "7"
      },
      {
        line: 9,
        label: "REG1",
        instruction: Mnemonic.DAT,
        argument: "0"
      },
      {
        line: 10,
        label: "VAR1",
        instruction: Mnemonic.DAT,
        argument: "0"
      }
    ]);
    expect(errors).toEqual([]);
  });
});

describe("errors for invalid declarations", () => {
  it("declaring an existing variable", () => {
    const ast: AST.Program = {
      node: "program",
      statements: [
        {
          node: "declaration",
          type: "bool",
          declaration: {
            node: "identifier",
            value: "b"
          }
        },
        {
          node: "declaration",
          type: "bool",
          declaration: {
            node: "identifier",
            value: "b"
          }
        }
      ]
    };
    const compiler = new TinyDudePlusCompiler();
    let { assembly, errors } = TinyDudePlusCompiler.compileAST(compiler, ast);

    expect(errors).toEqual(["variable already declared: b"]);
  });

  it("assigning an undeclared variable", () => {
    const ast: AST.Program = {
      node: "program",
      statements: [
        {
          node: "declaration",
          type: "bool",
          declaration: {
            node: "assignment",
            identifier: {
              node: "identifier",
              value: "b"
            },
            expression: {
              node: "identifier",
              value: "unknown"
            }
          }
        }
      ]
    };
    const compiler = new TinyDudePlusCompiler();
    let { assembly, errors } = TinyDudePlusCompiler.compileAST(compiler, ast);

    expect(errors).toEqual(["variable not defined: unknown"]);
  });
});
