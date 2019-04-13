import { TinyDudePlusCompiler } from "../../tinydudepluscompiler";
import { AST } from "../types";
import { evaluateOut } from "./out";
import { outputAccumulator } from "../routines/outputAccumulator";
import { mocked } from "ts-jest/utils";

jest.mock("../routines/outputAccumulator");

let evaluate = jest.fn(),
  compiler: TinyDudePlusCompiler,
  out: AST.Out;

beforeEach(() => {
  evaluate.mockClear();
  compiler = new TinyDudePlusCompiler();
  out = {
    node: "out",
    expression: {
      node: "identifier",
      value: "x"
    }
  };

  evaluateOut(compiler, out, evaluate);
});

it("evaluates the inside expression", () => {
  expect(evaluate).toHaveBeenCalledWith(out.expression);
});

it("outputs the accumulator", () => {
  expect(mocked(outputAccumulator)).toHaveBeenCalled();
});
