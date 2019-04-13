import { mocked } from "ts-jest/utils";
import { TinyDudePlusCompiler } from "../../tinydudepluscompiler";
import { AST } from "../types";
import { evaluateUnary } from "./unary";
import { evaluateUnaryNot } from "./operators/unaryNot";

jest.mock("../../tinydudepluscompiler");
jest.mock("./operators/unaryNot");

it("invokes evaluator for 'not' operator", () => {
  const evaluate = jest.fn();
  const compiler = new TinyDudePlusCompiler();
  const unary: AST.UnaryExpression = {
    node: "unary",
    operator: "not",
    expression: {
      node: "boolean",
      value: true
    }
  };

  evaluateUnary(compiler, unary, evaluate);

  expect(evaluateUnaryNot).toHaveBeenCalledWith(compiler, unary, evaluate);
});
