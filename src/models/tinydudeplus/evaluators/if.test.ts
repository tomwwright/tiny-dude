import { mocked } from "ts-jest/utils";
import { TinyDudePlusCompiler } from "../../tinydudepluscompiler";
import { AST } from "../types";
import { evaluateIf } from "./if";
import { subtractAccumulatorConstant } from "../routines/subtractAccumulator";
import { branchIfPositive } from "../routines/branch";

jest.mock("../routines/subtractAccumulator");
jest.mock("../routines/branch");
jest.mock("../../tinydudepluscompiler");

const mockedBranchIfPositive = mocked(branchIfPositive);

it("evaluates an if statement", () => {
  const evaluate = jest.fn();
  const compiler = new TinyDudePlusCompiler();
  const ifBlock: AST.Block = {
    node: "if",
    expression: {
      node: "boolean",
      value: true
    },
    statements: [
      {
        node: "declaration",
        type: "bool",
        declaration: {
          node: "identifier",
          value: "b"
        }
      }
    ]
  };

  mockedBranchIfPositive.mockReturnValueOnce("TESTFLOW");

  evaluateIf(compiler, ifBlock, evaluate);

  expect(evaluate).toHaveBeenNthCalledWith(1, ifBlock.expression);
  expect(evaluate).toHaveBeenNthCalledWith(2, ifBlock.statements[0]);
  expect(subtractAccumulatorConstant).toHaveBeenCalledWith(compiler, 1);
  expect(compiler.setPendingFlowLabel).toHaveBeenCalledWith("TESTFLOW");
});
