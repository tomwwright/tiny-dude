import { mocked } from "ts-jest/utils";
import { TinyDudePlusCompiler } from "../../../tinydudepluscompiler";
import { AST } from "../../types";
import { evaluateBinaryAnd } from "./binaryAnd";

import { storeAccumulator } from "../../routines/storeAccumulator";
import { addAccumulator } from "../../routines/addAccumulator";
import { isZeroAccumulator } from "../../routines/isZeroAccumulator";
import { subtractAccumulatorConstant } from "../../routines/subtractAccumulator";

jest.mock("../../../tinydudepluscompiler");
jest.mock("../../routines/storeAccumulator");
jest.mock("../../routines/addAccumulator");
jest.mock("../../routines/isZeroAccumulator");
jest.mock("../../routines/subtractAccumulator");

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
    node: "boolean",
    value: true
  }
};

beforeEach(() => {
  jest.clearAllMocks();
  mocked(compiler.allocateRegister).mockReturnValueOnce("REGX");
  evaluateBinaryAnd(compiler, binary, evaluate);
});

it("evaluates both sides", () => {
  expect(evaluate).toHaveBeenCalledTimes(2);
  expect(evaluate).toHaveBeenNthCalledWith(1, binary.right);
  expect(evaluate).toHaveBeenNthCalledWith(2, binary.left);
});

it("allocates and frees a register", () => {
  expect(compiler.allocateRegister).toHaveBeenCalledTimes(1);
  expect(compiler.freeRegister).toHaveBeenCalledWith("REGX");
});

it("stores and compares using the register", () => {
  expect(storeAccumulator).toHaveBeenCalledWith(compiler, "REGX");
  expect(addAccumulator).toHaveBeenCalledWith(compiler, "REGX");
  expect(subtractAccumulatorConstant).toHaveBeenCalledWith(compiler, 2);
});

it("sets up conditionals using not routine", () => {
  expect(isZeroAccumulator).toHaveBeenCalled();
});
