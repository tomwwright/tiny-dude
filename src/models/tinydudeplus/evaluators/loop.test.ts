import { mocked } from "ts-jest/utils";
import { TinyDudePlusCompiler } from "../../tinydudepluscompiler";
import { AST } from "../types";
import { evaluateLoop } from "./loop";
import { subtractAccumulatorConstant } from "../routines/subtractAccumulator";
import { branchIfPositive, branch } from "../routines/branch";

jest.mock("../routines/subtractAccumulator");
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

  mocked(branchIfPositive).mockReturnValueOnce("SKIPFLOW");
  mocked(compiler.allocateFlowLabel).mockReturnValueOnce("LOOPFLOW");

  evaluateLoop(compiler, ifBlock, evaluate);

  expect(evaluate).toHaveBeenNthCalledWith(1, ifBlock.expression);
  expect(evaluate).toHaveBeenNthCalledWith(2, ifBlock.statements[0]);
  expect(subtractAccumulatorConstant).toHaveBeenCalledWith(compiler, 1);
  expect(branch).toHaveBeenCalledWith(compiler, "LOOPFLOW");
  expect(compiler.setPendingFlowLabel).toHaveBeenNthCalledWith(1, "LOOPFLOW");
  expect(compiler.setPendingFlowLabel).toHaveBeenNthCalledWith(2, "SKIPFLOW");
});
