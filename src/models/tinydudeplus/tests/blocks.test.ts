import { TinyDudePlusCompiler } from "../../tinydudepluscompiler";
import { AST } from "../types";
import { Mnemonic } from "../../assemblycompiler";

it("compiles simple if statement", () => {
  const ast: AST.Program = {
    node: "program",
    statements: [
      {
        node: "if",
        expression: {
          node: "boolean",
          value: true
        },
        statements: [
          {
            node: "out",
            expression: {
              node: "boolean",
              value: true
            }
          }
        ]
      },
      {
        node: "out",
        expression: {
          node: "number",
          value: 3
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
      instruction: Mnemonic.SUB,
      argument: "CONST1"
    },
    {
      line: 3,
      label: null,
      instruction: Mnemonic.BRP,
      argument: "FLOW1"
    },
    {
      line: 4,
      label: null,
      instruction: Mnemonic.LDA,
      argument: "CONST1"
    },
    {
      line: 5,
      label: null,
      instruction: Mnemonic.OUT,
      argument: undefined
    },
    {
      line: 6,
      label: "FLOW1",
      instruction: Mnemonic.LDA,
      argument: "CONST3"
    },
    {
      line: 7,
      label: null,
      instruction: Mnemonic.OUT,
      argument: undefined
    },
    {
      line: 8,
      label: null,
      instruction: "HLT",
      argument: undefined
    },
    {
      line: 9,
      label: "CONST1",
      instruction: Mnemonic.DAT,
      argument: "1"
    },
    {
      line: 10,
      label: "CONST3",
      instruction: Mnemonic.DAT,
      argument: "3"
    }
  ]);
  expect(errors).toEqual([]);
});

it("compiles simple loop statement", () => {
  const ast: AST.Program = {
    node: "program",
    statements: [
      {
        node: "loop",
        expression: {
          node: "boolean",
          value: true
        },
        statements: [
          {
            node: "out",
            expression: {
              node: "boolean",
              value: true
            }
          }
        ]
      },
      {
        node: "out",
        expression: {
          node: "number",
          value: 3
        }
      }
    ]
  };
  const compiler = new TinyDudePlusCompiler();
  let { assembly, errors } = TinyDudePlusCompiler.compileAST(compiler, ast);

  expect(assembly).toEqual([
    {
      line: 1,
      label: "FLOW1",
      instruction: Mnemonic.LDA,
      argument: "CONST1"
    },
    {
      line: 2,
      label: null,
      instruction: Mnemonic.SUB,
      argument: "CONST1"
    },
    {
      line: 3,
      label: null,
      instruction: Mnemonic.BRP,
      argument: "FLOW2"
    },
    {
      line: 4,
      label: null,
      instruction: Mnemonic.LDA,
      argument: "CONST1"
    },
    {
      line: 5,
      label: null,
      instruction: Mnemonic.OUT,
      argument: undefined
    },
    {
      line: 6,
      label: null,
      instruction: Mnemonic.BRA,
      argument: "FLOW1"
    },
    {
      line: 7,
      label: "FLOW2",
      instruction: Mnemonic.LDA,
      argument: "CONST3"
    },
    {
      line: 8,
      label: null,
      instruction: Mnemonic.OUT,
      argument: undefined
    },
    {
      line: 9,
      label: null,
      instruction: "HLT",
      argument: undefined
    },
    {
      line: 10,
      label: "CONST1",
      instruction: Mnemonic.DAT,
      argument: "1"
    },
    {
      line: 11,
      label: "CONST3",
      instruction: Mnemonic.DAT,
      argument: "3"
    }
  ]);
  expect(errors).toEqual([]);
});
