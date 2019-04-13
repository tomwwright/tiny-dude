import { mocked } from "ts-jest/utils";
import { TinyDudePlusCompiler } from "../../tinydudepluscompiler";
import { AST } from "../types";
import { evaluateProgram } from "./program";
import { compileDats } from "../routines/compileDats";

jest.mock("../../tinydudepluscompiler");
jest.mock("../routines/compileDats");

const evaluate = jest.fn();
const compiler = new TinyDudePlusCompiler();
const program: AST.Program = {
  node: "program",
  statements: [
    {
      node: "declaration",
      type: "num",
      declaration: {
        node: "identifier",
        value: "x"
      }
    },
    {
      node: "out",
      expression: {
        node: "identifier",
        value: "x"
      }
    }
  ]
};

beforeEach(() => {
  jest.clearAllMocks();
  evaluateProgram(compiler, program, evaluate);
});

it("evaluates each statement", () => {
  expect(evaluate).toHaveBeenCalledTimes(2);
  expect(evaluate).toHaveBeenNthCalledWith(1, program.statements[0]);
  expect(evaluate).toHaveBeenNthCalledWith(2, program.statements[1]);
});

it("compiles DATs", () => {
  expect(compileDats).toHaveBeenCalled();
});
