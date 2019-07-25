import { mocked } from "ts-jest/utils";
import { TinyDudePlusCompiler } from "../../tinydudepluscompiler";
import { AST } from "../types";
import { evaluateIf } from "./if";
import { branchIfZero } from "../routines/branch";

jest.mock("../routines/branch");
jest.mock("../../tinydudepluscompiler");

const mockedBranchIfZero = mocked(branchIfZero);

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

  mockedBranchIfZero.mockReturnValueOnce("TESTFLOW");

  evaluateIf(compiler, ifBlock, evaluate);

  expect(evaluate).toHaveBeenNthCalledWith(1, ifBlock.expression);
  expect(evaluate).toHaveBeenNthCalledWith(2, ifBlock.statements[0]);
  expect(compiler.setPendingFlowLabel).toHaveBeenCalledWith(ifBlock, "TESTFLOW");
});
