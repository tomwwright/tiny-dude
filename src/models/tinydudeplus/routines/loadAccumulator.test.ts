import { mocked } from "ts-jest/utils";
import { TinyDudePlusCompiler } from "../../tinydudepluscompiler";
import { Mnemonic } from "../../assemblycompiler";
import { loadAccumulator, loadAccumulatorConstant } from "./loadAccumulator";

jest.mock("../../tinydudepluscompiler");

let compiler: TinyDudePlusCompiler;

beforeEach(() => {
  mocked(TinyDudePlusCompiler).mockClear();
  compiler = new TinyDudePlusCompiler();
});

it("load accumulator from correct symbol", () => {
  mocked(compiler.getSymbol).mockReturnValueOnce({
    label: "VAR1",
    type: "num"
  });

  loadAccumulator(compiler, "test");

  expect(mocked(compiler.addAssemblyStatement)).toHaveBeenCalledWith({
    instruction: Mnemonic.LDA,
    argument: "VAR1"
  });
});

it("throws an error if trying to load from undefined variable", () => {
  mocked(compiler.getSymbol).mockReturnValueOnce(null);

  expect(() => loadAccumulator(compiler, "test")).toThrowError();
});

it("load accumulator from correct symbol", () => {
  mocked(compiler.defineConstant).mockReturnValueOnce({
    label: "CONST1",
    type: "const"
  });

  loadAccumulatorConstant(compiler, 3);

  expect(mocked(compiler.addAssemblyStatement)).toHaveBeenCalledWith({
    instruction: Mnemonic.LDA,
    argument: "CONST1"
  });
});
