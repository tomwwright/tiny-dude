import { mocked } from "ts-jest/utils";
import { TinyDudePlusCompiler } from "../../tinydudepluscompiler";
import { Mnemonic } from "../../assemblycompiler";
import { outputAccumulator } from "./outputAccumulator";

jest.mock("../../tinydudepluscompiler");

let compiler: TinyDudePlusCompiler;

beforeEach(() => {
  mocked(TinyDudePlusCompiler).mockClear();
  compiler = new TinyDudePlusCompiler();
});

it("creates an output assembly statement", () => {
  outputAccumulator(compiler);

  expect(mocked(compiler.addAssemblyStatement)).toHaveBeenCalledWith({
    instruction: Mnemonic.OUT
  });
});
