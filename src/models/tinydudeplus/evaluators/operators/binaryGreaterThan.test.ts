import { mocked } from "ts-jest/utils";
import { TinyDudePlusCompiler } from "../../../tinydudepluscompiler";
import { AST } from "../../types";
import { evaluateBinaryGreaterThan } from "./binaryGreaterThan";

import { loadAccumulatorConstant } from "../../routines/loadAccumulator";
import { storeAccumulator } from "../../routines/storeAccumulator";
import { subtractAccumulator } from "../../routines/subtractAccumulator";
import { branch, branchIfPositive } from "../../routines/branch";

jest.mock("../../../tinydudepluscompiler");
jest.mock("../../routines/loadAccumulator");
jest.mock("../../routines/storeAccumulator");
jest.mock("../../routines/subtractAccumulator");
jest.mock("../../routines/branch");

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

beforeEach(() => {
  jest.clearAllMocks();
  mocked(compiler.allocateRegister).mockReturnValueOnce("REGX");
  mocked(branchIfPositive).mockReturnValueOnce("FALSE_CASE");
  evaluateBinaryGreaterThan(compiler, binary, evaluate);
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
  expect(subtractAccumulator).toHaveBeenCalledWith(compiler, "REGX");
});

it("sets up a true and false case", () => {
  expect(loadAccumulatorConstant).toHaveBeenCalledWith(compiler, 1);
  expect(loadAccumulatorConstant).toHaveBeenCalledWith(compiler, 0);
});

it("sets up a conditional to jump", () => {
  expect(branchIfPositive).toHaveBeenCalledTimes(1);
  expect(compiler.setPendingFlowLabel).toHaveBeenCalledWith("FALSE_CASE");
});
