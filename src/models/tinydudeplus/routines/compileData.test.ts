import { mocked } from "ts-jest/utils";
import { TinyDudePlusCompiler } from "../../tinydudepluscompiler";
import { Mnemonic } from "../../assemblycompiler";
import { compileDats } from "./compileDats";

jest.mock("../../tinydudepluscompiler");

let compiler: TinyDudePlusCompiler;

beforeEach(() => {
  mocked(TinyDudePlusCompiler).mockClear();
  compiler = new TinyDudePlusCompiler();

  mocked(compiler.getSymbols).mockReturnValue([
    {
      label: "VAR1",
      type: "num",
      key: "x"
    },
    {
      label: "VAR2",
      type: "bool",
      key: "f"
    },
    {
      label: "CONST1",
      type: "const",
      key: "1"
    },
    {
      label: "REG1",
      type: "register",
      key: "REG1"
    }
  ]);
  compileDats(compiler);
});

it("creates the correct number of DAT instructions", () => {
  expect(compiler.getSymbols).toHaveBeenCalled();
  expect(compiler.addAssemblyStatement).toHaveBeenCalledTimes(4);
});

it("orders the DAT instructions by label", () => {
  const calls = mocked(compiler.addAssemblyStatement).mock.calls.map(call => call[0]);

  expect(calls).toEqual([
    {
      instruction: Mnemonic.DAT,
      label: "CONST1",
      argument: "1"
    },
    {
      instruction: Mnemonic.DAT,
      label: "REG1",
      argument: "0"
    },
    {
      instruction: Mnemonic.DAT,
      label: "VAR1",
      argument: "0"
    },
    {
      instruction: Mnemonic.DAT,
      label: "VAR2",
      argument: "0"
    }
  ]);
});
