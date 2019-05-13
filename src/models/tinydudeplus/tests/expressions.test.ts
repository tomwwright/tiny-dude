import { TinyDudePlusCompiler } from "../../tinydudepluscompiler";
import { AST } from "../types";
import { Mnemonic } from "../../assemblycompiler";

describe("logic expressions", () => {
  it("compiles simple unary expression", () => {
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
              value: "input"
            },
            expression: {
              node: "boolean",
              value: false
            }
          }
        },
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
              node: "unary",
              operator: "not",
              expression: {
                node: "identifier",
                value: "input"
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
        argument: "CONST0"
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
        instruction: Mnemonic.LDA,
        argument: "VAR1"
      },
      {
        line: 4,
        label: null,
        instruction: Mnemonic.BRZ,
        argument: "FLOW1"
      },
      {
        line: 5,
        label: null,
        instruction: Mnemonic.LDA,
        argument: "CONST0"
      },
      {
        line: 6,
        label: null,
        instruction: Mnemonic.BRA,
        argument: "FLOW2"
      },
      {
        line: 7,
        label: "FLOW1",
        instruction: Mnemonic.LDA,
        argument: "CONST1"
      },
      {
        line: 8,
        label: "FLOW2",
        instruction: Mnemonic.STA,
        argument: "VAR2"
      },
      {
        line: 9,
        label: null,
        instruction: "HLT",
        argument: undefined
      },
      {
        line: 10,
        label: "CONST0",
        instruction: Mnemonic.DAT,
        argument: "0"
      },
      {
        line: 11,
        label: "CONST1",
        instruction: Mnemonic.DAT,
        argument: "1"
      },
      {
        line: 12,
        label: "VAR1",
        instruction: Mnemonic.DAT,
        argument: "0"
      },
      {
        line: 13,
        label: "VAR2",
        instruction: Mnemonic.DAT,
        argument: "0"
      }
    ]);
    expect(errors).toEqual([]);
  });

  it("compiles simple greater than expression", () => {
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
              value: "input"
            },
            expression: {
              node: "number",
              value: 3
            }
          }
        },
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
              node: "binary",
              operator: ">=",
              left: {
                node: "identifier",
                value: "input"
              },
              right: {
                node: "number",
                value: 5
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
        argument: "VAR1"
      },
      {
        line: 3,
        label: null,
        instruction: Mnemonic.LDA,
        argument: "CONST5"
      },
      {
        line: 4,
        label: null,
        instruction: Mnemonic.STA,
        argument: "REG1"
      },
      {
        line: 5,
        label: null,
        instruction: Mnemonic.LDA,
        argument: "VAR1"
      },
      {
        line: 6,
        label: null,
        instruction: Mnemonic.SUB,
        argument: "REG1"
      },
      {
        line: 7,
        label: null,
        instruction: Mnemonic.BRP,
        argument: "FLOW1"
      },
      {
        line: 8,
        label: null,
        instruction: Mnemonic.LDA,
        argument: "CONST0"
      },
      {
        line: 9,
        label: null,
        instruction: Mnemonic.BRA,
        argument: "FLOW2"
      },
      {
        line: 10,
        label: "FLOW1",
        instruction: Mnemonic.LDA,
        argument: "CONST1"
      },
      {
        line: 11,
        label: "FLOW2",
        instruction: Mnemonic.STA,
        argument: "VAR2"
      },
      {
        line: 12,
        label: null,
        instruction: Mnemonic.HLT,
        argument: undefined
      },
      {
        line: 13,
        label: "CONST0",
        instruction: Mnemonic.DAT,
        argument: "0"
      },
      {
        line: 14,
        label: "CONST1",
        instruction: Mnemonic.DAT,
        argument: "1"
      },
      {
        line: 15,
        label: "CONST3",
        instruction: Mnemonic.DAT,
        argument: "3"
      },
      {
        line: 16,
        label: "CONST5",
        instruction: Mnemonic.DAT,
        argument: "5"
      },
      {
        line: 17,
        label: "REG1",
        instruction: Mnemonic.DAT,
        argument: "0"
      },
      {
        line: 18,
        label: "VAR1",
        instruction: Mnemonic.DAT,
        argument: "0"
      },
      {
        line: 19,
        label: "VAR2",
        instruction: Mnemonic.DAT,
        argument: "0"
      }
    ]);
    expect(errors).toEqual([]);
  });
});

describe("arithmetic expressions", () => {
  it("compiles chained addition of constants expression", () => {
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
              value: "input"
            },
            expression: {
              node: "number",
              value: 3
            }
          }
        },
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
                node: "identifier",
                value: "input"
              },
              right: {
                node: "binary",
                operator: "+",
                left: {
                  node: "number",
                  value: 2
                },
                right: {
                  node: "binary",
                  operator: "+",
                  left: {
                    node: "number",
                    value: 4
                  },
                  right: {
                    node: "number",
                    value: 1
                  }
                }
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
        argument: "VAR1"
      },
      {
        line: 3,
        label: null,
        instruction: Mnemonic.LDA,
        argument: "VAR1"
      },
      {
        line: 4,
        label: null,
        instruction: Mnemonic.STA,
        argument: "REG1"
      },
      {
        line: 5,
        label: null,
        instruction: Mnemonic.LDA,
        argument: "CONST2"
      },
      {
        line: 6,
        label: null,
        instruction: Mnemonic.STA,
        argument: "REG2"
      },
      {
        line: 7,
        label: null,
        instruction: Mnemonic.LDA,
        argument: "CONST4"
      },
      {
        line: 8,
        label: null,
        instruction: Mnemonic.STA,
        argument: "REG3"
      },
      {
        line: 9,
        label: null,
        instruction: Mnemonic.LDA,
        argument: "CONST1"
      },
      {
        line: 10,
        label: null,
        instruction: Mnemonic.ADD,
        argument: "REG3"
      },
      {
        line: 11,
        label: null,
        instruction: Mnemonic.ADD,
        argument: "REG2"
      },
      {
        line: 12,
        label: null,
        instruction: Mnemonic.ADD,
        argument: "REG1"
      },
      {
        line: 13,
        label: null,
        instruction: Mnemonic.STA,
        argument: "VAR2"
      },
      {
        line: 14,
        label: null,
        instruction: Mnemonic.HLT,
        argument: undefined
      },
      {
        line: 15,
        label: "CONST1",
        instruction: Mnemonic.DAT,
        argument: "1"
      },
      {
        line: 16,
        label: "CONST2",
        instruction: Mnemonic.DAT,
        argument: "2"
      },
      {
        line: 17,
        label: "CONST3",
        instruction: Mnemonic.DAT,
        argument: "3"
      },
      {
        line: 18,
        label: "CONST4",
        instruction: Mnemonic.DAT,
        argument: "4"
      },
      {
        line: 19,
        label: "REG1",
        instruction: Mnemonic.DAT,
        argument: "0"
      },
      {
        line: 20,
        label: "REG2",
        instruction: Mnemonic.DAT,
        argument: "0"
      },
      {
        line: 21,
        label: "REG3",
        instruction: Mnemonic.DAT,
        argument: "0"
      },
      {
        line: 22,
        label: "VAR1",
        instruction: Mnemonic.DAT,
        argument: "0"
      },
      {
        line: 23,
        label: "VAR2",
        instruction: Mnemonic.DAT,
        argument: "0"
      }
    ]);
    expect(errors).toEqual([]);
  });
});
