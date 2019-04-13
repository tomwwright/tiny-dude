import { mocked } from "ts-jest/utils";
import { TinyDudePlusCompiler } from "../../../tinydudepluscompiler";
import { AST } from "../../types";
import { evaluateBinaryAdd } from "./binaryAdd";
import { storeAccumulator } from "../../routines/storeAccumulator";
import { addAccumulator } from "../../routines/addAccumulator";

jest.mock("../../../tinydudepluscompiler");
jest.mock("../../routines/storeAccumulator");
jest.mock("../../routines/addAccumulator");

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

beforeEach(() => {
  jest.clearAllMocks();
  mocked(compiler.allocateRegister).mockReturnValueOnce("REGX");
  evaluateBinaryAdd(compiler, binary, evaluate);
});

it("evaluates both sides", () => {
  expect(evaluate).toHaveBeenCalledTimes(2);
  expect(evaluate).toHaveBeenNthCalledWith(1, binary.left);
  expect(evaluate).toHaveBeenNthCalledWith(2, binary.right);
});

it("allocates and frees a register", () => {
  expect(compiler.allocateRegister).toHaveBeenCalledTimes(1);
  expect(compiler.freeRegister).toHaveBeenCalledWith("REGX");
});

it("stores and adds using the register", () => {
  expect(storeAccumulator).toHaveBeenCalledWith(compiler, "REGX");
  expect(addAccumulator).toHaveBeenCalledWith(compiler, "REGX");
});
