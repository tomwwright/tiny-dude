import { mocked } from "ts-jest/utils";
import { TinyDudePlusCompiler } from "../../../tinydudepluscompiler";
import { AST } from "../../types";
import { evaluateUnaryNot } from "./unaryNot";
import { loadAccumulatorConstant } from "../../routines/loadAccumulator";
import { branch, branchIfZero } from "../../routines/branch";

jest.mock("../../../tinydudepluscompiler");
jest.mock("../../routines/loadAccumulator");
jest.mock("../../routines/branch");

const evaluate = jest.fn();
const compiler = new TinyDudePlusCompiler();
const unary: AST.UnaryExpression = {
  node: "unary",
  operator: "not",
  expression: {
    node: "identifier",
    value: "b"
  }
};

beforeEach(() => {
  jest.clearAllMocks();
  mocked(branchIfZero).mockReturnValueOnce("JUMPZERO");
  mocked(branch).mockReturnValueOnce("JUMP");
  evaluateUnaryNot(compiler, unary, evaluate);
});

it("evaluates expression", () => {
  expect(evaluate).toHaveBeenCalledTimes(1);
  expect(evaluate).toHaveBeenCalledWith(unary.expression);
});

it("sets expected pending labels", () => {
  expect(compiler.setPendingFlowLabel).toHaveBeenCalledTimes(2);
  expect(compiler.setPendingFlowLabel).toHaveBeenNthCalledWith(1, unary, "JUMPZERO");
  expect(compiler.setPendingFlowLabel).toHaveBeenNthCalledWith(2, unary, "JUMP");
});
