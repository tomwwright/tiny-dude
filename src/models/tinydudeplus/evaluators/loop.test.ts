import { mocked } from "ts-jest/utils";
import { TinyDudePlusCompiler } from "../../tinydudepluscompiler";
import { AST } from "../types";
import { evaluateLoop } from "./loop";
import { branchIfZero, branch } from "../routines/branch";

jest.mock("../routines/branch");
jest.mock("../../tinydudepluscompiler");

it("evaluates a loop statement", () => {
  const evaluate = jest.fn();
  const compiler = new TinyDudePlusCompiler();
  const ifBlock: AST.Block = {
    node: "loop",
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

  mocked(branchIfZero).mockReturnValueOnce("SKIPFLOW");
  mocked(compiler.allocateFlowLabel).mockReturnValueOnce("LOOPFLOW");

  evaluateLoop(compiler, ifBlock, evaluate);

  expect(evaluate).toHaveBeenNthCalledWith(1, ifBlock.expression);
  expect(evaluate).toHaveBeenNthCalledWith(2, ifBlock.statements[0]);
  expect(branch).toHaveBeenCalledWith(compiler, "LOOPFLOW");
  expect(compiler.setPendingFlowLabel).toHaveBeenNthCalledWith(1, ifBlock, "LOOPFLOW");
  expect(compiler.setPendingFlowLabel).toHaveBeenNthCalledWith(2, ifBlock, "SKIPFLOW");
});
