import { mocked } from "ts-jest/utils";
import { TinyDudePlusCompiler } from "../tinydudepluscompiler";
import { evaluate } from "./evaluate";
import { AST } from "./types";

import { evaluateProgram } from "./evaluators/program";
import { evaluateNumber, evaluateBoolean, evaluateIdentifier } from "./evaluators/term";
import { evaluateUnary } from "./evaluators/unary";
import { evaluateDeclaration } from "./evaluators/declaration";
import { evaluateAssignment } from "./evaluators/assignment";
import { evaluateBrackets } from "./evaluators/brackets";
import { evaluateOut } from "./evaluators/out";
import { evaluateBinary } from "./evaluators/binary";
import { evaluateIf } from "./evaluators/if";
import { evaluateLoop } from "./evaluators/loop";

jest.mock("../tinydudepluscompiler");
jest.mock("./evaluators/program");
jest.mock("./evaluators/term");
jest.mock("./evaluators/unary");
jest.mock("./evaluators/declaration");
jest.mock("./evaluators/assignment");
jest.mock("./evaluators/brackets");
jest.mock("./evaluators/out");
jest.mock("./evaluators/binary");
jest.mock("./evaluators/if");
jest.mock("./evaluators/loop");

let compiler = new TinyDudePlusCompiler();

beforeEach(() => {
  mocked(TinyDudePlusCompiler).mockClear();
  compiler = new TinyDudePlusCompiler();
});

it("evaluates program", () => {
  const program: AST.Program = {
    node: "program",
    statements: []
  };
  evaluate(compiler, program);
  expect(evaluateProgram).toHaveBeenCalled();
});

it("evaluates comment", () => {
  const comment: AST.Comment = {
    node: "comment",
    comment: "this is my comment"
  };
  evaluate(compiler, comment);
});

it("evaluates out", () => {
  const out: AST.Out = {
    node: "out",
    expression: {
      node: "number",
      value: 3
    }
  };
  evaluate(compiler, out);

  expect(evaluateOut).toHaveBeenCalled();
});

it("evaluates declaration", () => {
  const declaration: AST.Declaration = {
    node: "declaration",
    type: "num",
    declaration: {
      node: "identifier",
      value: "x"
    }
  };
  evaluate(compiler, declaration);
  expect(evaluateDeclaration).toHaveBeenCalled();
});

it("evaluates assignment", () => {
  const assignment: AST.Assignment = {
    node: "assignment",
    identifier: {
      node: "identifier",
      value: "x"
    },
    expression: {
      node: "number",
      value: 3
    }
  };
  evaluate(compiler, assignment);
  expect(evaluateAssignment).toHaveBeenCalled();
});

it("evaluates brackets", () => {
  const brackets: AST.BracketsExpression = {
    node: "brackets",
    expression: {
      node: "number",
      value: 3
    }
  };
  evaluate(compiler, brackets);
  expect(evaluateBrackets).toHaveBeenCalled();
});

it("evaluates identifier", () => {
  const identifier: AST.IdentifierTerm = {
    node: "identifier",
    value: "x"
  };
  evaluate(compiler, identifier);
  expect(evaluateIdentifier).toHaveBeenCalled();
});

it("evaluates boolean", () => {
  const boolean: AST.BooleanTerm = {
    node: "boolean",
    value: true
  };
  evaluate(compiler, boolean);
  expect(evaluateBoolean).toHaveBeenCalled();
});

it("evaluates number", () => {
  const number: AST.NumberTerm = {
    node: "number",
    value: 4
  };
  evaluate(compiler, number);
  expect(evaluateNumber).toHaveBeenCalled();
});

it("evaluates unary", () => {
  const unary: AST.UnaryExpression = {
    node: "unary",
    operator: "not",
    expression: {
      node: "boolean",
      value: true
    }
  };
  evaluate(compiler, unary);
  expect(evaluateUnary).toHaveBeenCalled();
});

it("evaluates binary", () => {
  const binary: AST.BinaryExpression = {
    node: "binary",
    operator: "+",
    left: {
      node: "number",
      value: 3
    },
    right: {
      node: "identifier",
      value: "x"
    }
  };
  evaluate(compiler, binary);
  expect(evaluateBinary).toHaveBeenCalled();
});

it("evaluates if block", () => {
  const ifBlock: AST.Block = {
    node: "if",
    expression: {
      node: "identifier",
      value: "b"
    },
    statements: []
  };
  evaluate(compiler, ifBlock);
  expect(evaluateIf).toHaveBeenCalled();
});

it("evaluates loop block", () => {
  const loopBlock: AST.Block = {
    node: "loop",
    expression: {
      node: "identifier",
      value: "b"
    },
    statements: []
  };
  evaluate(compiler, loopBlock);
  expect(evaluateLoop).toHaveBeenCalled();
});
