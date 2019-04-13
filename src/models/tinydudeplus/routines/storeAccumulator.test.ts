import { mocked } from "ts-jest/utils";
import { TinyDudePlusCompiler } from "../../tinydudepluscompiler";
import { Mnemonic } from "../../assemblycompiler";
import { storeAccumulator } from "./storeAccumulator";

jest.mock("../../tinydudepluscompiler");

let compiler: TinyDudePlusCompiler;

beforeEach(() => {
  mocked(TinyDudePlusCompiler).mockClear();
  compiler = new TinyDudePlusCompiler();
});

it("store accumulator into correct symbol", () => {
  mocked(compiler.getSymbol).mockReturnValueOnce({
    label: "VAR1",
    type: "num"
  });

  storeAccumulator(compiler, "test");

  expect(mocked(compiler.addAssemblyStatement)).toHaveBeenCalledWith({
    instruction: Mnemonic.STA,
    argument: "VAR1"
  });
});

it("throws an error if trying to store into an undefined variable", () => {
  mocked(compiler.getSymbol).mockReturnValueOnce(null);

  expect(() => storeAccumulator(compiler, "test")).toThrowError();
});
