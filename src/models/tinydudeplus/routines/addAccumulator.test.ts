import { mocked } from "ts-jest/utils";
import { TinyDudePlusCompiler } from "../../tinydudepluscompiler";
import { Mnemonic } from "../../assemblycompiler";
import { addAccumulator, addAccumulatorConstant } from "./addAccumulator";

jest.mock("../../tinydudepluscompiler");

let compiler: TinyDudePlusCompiler;

beforeEach(() => {
  mocked(TinyDudePlusCompiler).mockClear();
  compiler = new TinyDudePlusCompiler();

  mocked(compiler.getSymbol).mockReturnValueOnce({
    label: "VAR1",
    type: "num"
  });
});

it("adds the correct assembly statement", () => {
  addAccumulator(compiler, "test");

  expect(mocked(compiler.addAssemblyStatement)).toHaveBeenCalledWith({
    instruction: Mnemonic.ADD,
    argument: "VAR1"
  });
});

it("add constant to accumulator from correct symbol", () => {
  mocked(compiler.defineConstant).mockReturnValueOnce({
    label: "CONST1",
    type: "const"
  });

  addAccumulatorConstant(compiler, 3);

  expect(mocked(compiler.addAssemblyStatement)).toHaveBeenCalledWith({
    instruction: Mnemonic.ADD,
    argument: "CONST1"
  });
});
