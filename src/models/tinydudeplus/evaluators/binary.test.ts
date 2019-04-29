import { mocked } from "ts-jest/utils";
import { TinyDudePlusCompiler } from "../../tinydudepluscompiler";
import { AST } from "../types";
import { evaluateBinary } from "./binary";
import { evaluateBinaryAdd } from "./operators/binaryAdd";
import { evaluateBinarySubtract } from "./operators/binarySubtract";
import { evaluateBinaryGreaterThan } from "./operators/binaryGreaterThan";
import { evaluateBinaryEquals } from "./operators/binaryEquals";

jest.mock("../../tinydudepluscompiler");
jest.mock("./operators/binaryAdd");
jest.mock("./operators/binarySubtract");
jest.mock("./operators/binaryGreaterThan");
jest.mock("./operators/binaryEquals");

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
    operator: ">",
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

  expect(evaluateBinaryGreaterThan).toHaveBeenCalledWith(compiler, binary, evaluate);
});

it("switches expression and invokes evaluator for < operator", () => {
  const evaluate = jest.fn();
  const compiler = new TinyDudePlusCompiler();
  const binary: AST.BinaryExpression = {
    node: "binary",
    operator: "<",
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
    operator: ">",
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

  expect(evaluateBinaryGreaterThan).toHaveBeenCalledWith(compiler, switchedBinary, evaluate);
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

