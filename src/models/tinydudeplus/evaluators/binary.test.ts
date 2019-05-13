import { mocked } from "ts-jest/utils";
import { TinyDudePlusCompiler } from "../../tinydudepluscompiler";
import { AST } from "../types";
import { evaluateBinary } from "./binary";
import { evaluateBinaryAdd } from "./operators/binaryAdd";
import { evaluateBinarySubtract } from "./operators/binarySubtract";
import { evaluateBinaryGreaterThanEquals } from "./operators/binaryGreaterThanEquals";
import { evaluateBinaryEquals } from "./operators/binaryEquals";
import { evaluateBinaryAnd } from "./operators/binaryAnd";
import { evaluateBinaryOr } from "./operators/binaryOr";

jest.mock("../../tinydudepluscompiler");
jest.mock("./operators/binaryAdd");
jest.mock("./operators/binarySubtract");
jest.mock("./operators/binaryGreaterThanEquals");
jest.mock("./operators/binaryEquals");
jest.mock("./operators/binaryAnd");
jest.mock("./operators/binaryOr");

it("invokes evaluator for + operator", () => {
  const evaluate = jest.fn();
  const compiler = new TinyDudePlusCompiler();
  const binary: AST.BinaryExpression = {
    node: "binary",
    operator: "+",
    left: {
      node: "identifier",
      value: "x"
    },
    right: {
      node: "number",
      value: 3
    }
  };

  evaluateBinary(compiler, binary, evaluate);

  expect(evaluateBinaryAdd).toHaveBeenCalledWith(compiler, binary, evaluate);
});

it("invokes evaluator for - operator", () => {
  const evaluate = jest.fn();
  const compiler = new TinyDudePlusCompiler();
  const binary: AST.BinaryExpression = {
    node: "binary",
    operator: "-",
    left: {
      node: "identifier",
      value: "x"
    },
    right: {
      node: "number",
      value: 3
    }
  };

  evaluateBinary(compiler, binary, evaluate);

  expect(evaluateBinarySubtract).toHaveBeenCalledWith(compiler, binary, evaluate);
});

it("invokes evaluator for / operator", () => {
  const evaluate = jest.fn();
  const compiler = new TinyDudePlusCompiler();
  const binary: AST.BinaryExpression = {
    node: "binary",
    operator: "*",
    left: {
      node: "identifier",
      value: "x"
    },
    right: {
      node: "number",
      value: 3
    }
  };

  evaluateBinary(compiler, binary, evaluate);
});

it("invokes evaluator for * operator", () => {
  const evaluate = jest.fn();
  const compiler = new TinyDudePlusCompiler();
  const binary: AST.BinaryExpression = {
    node: "binary",
    operator: "/",
    left: {
      node: "identifier",
      value: "x"
    },
    right: {
      node: "number",
      value: 3
    }
  };

  evaluateBinary(compiler, binary, evaluate);
});

it("invokes evaluator for > operator", () => {
  const evaluate = jest.fn();
  const compiler = new TinyDudePlusCompiler();
  const binary: AST.BinaryExpression = {
    node: "binary",
    operator: ">=",
    left: {
      node: "identifier",
      value: "x"
    },
    right: {
      node: "number",
      value: 3
    }
  };

  evaluateBinary(compiler, binary, evaluate);

  expect(evaluateBinaryGreaterThanEquals).toHaveBeenCalledWith(compiler, binary, evaluate);
});

it("switches expression and invokes evaluator for < operator", () => {
  const evaluate = jest.fn();
  const compiler = new TinyDudePlusCompiler();
  const binary: AST.BinaryExpression = {
    node: "binary",
    operator: "<=",
    right: {
      node: "identifier",
      value: "x"
    },
    left: {
      node: "number",
      value: 3
    }
  };
  const switchedBinary: AST.BinaryExpression = {
    node: "binary",
    operator: ">=",
    left: {
      node: "identifier",
      value: "x"
    },
    right: {
      node: "number",
      value: 3
    }
  };

  evaluateBinary(compiler, binary, evaluate);

  expect(evaluateBinaryGreaterThanEquals).toHaveBeenCalledWith(compiler, switchedBinary, evaluate);
});

it("invokes evaluator for == operator", () => {
  const evaluate = jest.fn();
  const compiler = new TinyDudePlusCompiler();
  const binary: AST.BinaryExpression = {
    node: "binary",
    operator: "==",
    left: {
      node: "identifier",
      value: "x"
    },
    right: {
      node: "number",
      value: 3
    }
  };

  evaluateBinary(compiler, binary, evaluate);

  expect(evaluateBinaryEquals).toHaveBeenCalledWith(compiler, binary, evaluate);
});

it("invokes evaluator for 'and' operator", () => {
  const evaluate = jest.fn();
  const compiler = new TinyDudePlusCompiler();
  const binary: AST.BinaryExpression = {
    node: "binary",
    operator: "and",
    left: {
      node: "identifier",
      value: "b"
    },
    right: {
      node: "identifier",
      value: "b2"
    }
  };

  evaluateBinary(compiler, binary, evaluate);

  expect(evaluateBinaryAnd).toHaveBeenCalledWith(compiler, binary, evaluate);
});

it("invokes evaluator for 'or' operator", () => {
  const evaluate = jest.fn();
  const compiler = new TinyDudePlusCompiler();
  const binary: AST.BinaryExpression = {
    node: "binary",
    operator: "or",
    left: {
      node: "identifier",
      value: "b"
    },
    right: {
      node: "identifier",
      value: "b2"
    }
  };

  evaluateBinary(compiler, binary, evaluate);

  expect(evaluateBinaryOr).toHaveBeenCalledWith(compiler, binary, evaluate);
});
