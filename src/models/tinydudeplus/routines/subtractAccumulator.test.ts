import { mocked } from "ts-jest/utils";
import { TinyDudePlusCompiler } from "../../tinydudepluscompiler";
import { Mnemonic } from "../../assemblycompiler";
import { subtractAccumulator, subtractAccumulatorConstant } from "./subtractAccumulator";

jest.mock("../../tinydudepluscompiler");

let compiler: TinyDudePlusCompiler;

beforeEach(() => {
  mocked(TinyDudePlusCompiler).mockClear();
  compiler = new TinyDudePlusCompiler();
});

it("subtract correct symbol from accumulator", () => {
  mocked(compiler.getSymbol).mockReturnValueOnce({
    label: "VAR1",
    type: "num"
  });

  subtractAccumulator(compiler, "test");

  expect(mocked(compiler.addAssemblyStatement)).toHaveBeenCalledWith({
    instruction: Mnemonic.SUB,
    argument: "VAR1"
  });
});

it("throws an error if trying to subtract an undefined variable", () => {
  mocked(compiler.getSymbol).mockReturnValueOnce(null);

  expect(() => subtractAccumulator(compiler, "test")).toThrowError();
});

it("subtract constant from accumulator from correct symbol", () => {
  mocked(compiler.defineConstant).mockReturnValueOnce({
    label: "CONST1",
    type: "const"
  });

  subtractAccumulatorConstant(compiler, 3);

  expect(mocked(compiler.addAssemblyStatement)).toHaveBeenCalledWith({
    instruction: Mnemonic.SUB,
    argument: "CONST1"
  });
});
