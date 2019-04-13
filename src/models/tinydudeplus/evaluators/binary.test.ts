import { mocked } from "ts-jest/utils";
import { TinyDudePlusCompiler } from "../../tinydudepluscompiler";
import { AST } from "../types";
import { evaluateBinary } from "./binary";
import { evaluateBinaryAdd } from "./operators/binaryAdd";
import { evaluateBinarySubtract } from "./operators/binarySubtract";

jest.mock("../../tinydudepluscompiler");
jest.mock("./operators/binaryAdd");
jest.mock("./operators/binarySubtract");

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
