import { mocked } from "ts-jest/utils";
import { TinyDudePlusCompiler } from "../../tinydudepluscompiler";
import { Mnemonic } from "../../assemblycompiler";
import { declareVariable } from "./declareVariable";

jest.mock("../../tinydudepluscompiler");

let compiler: TinyDudePlusCompiler;

beforeEach(() => {
  mocked(TinyDudePlusCompiler).mockClear();
  compiler = new TinyDudePlusCompiler();
});

it("defines the variable correctly", () => {
  mocked(compiler.getSymbol).mockReturnValueOnce(null);
  mocked(compiler.defineVariable).mockReturnValueOnce({
    label: "VAR1",
    type: "num"
  });

  const symbol = declareVariable(compiler, "num", "x");

  expect(mocked(compiler.defineVariable)).toHaveBeenCalledWith("num", "x");
  expect(symbol).toEqual({
    label: "VAR1",
    type: "num"
  });
});

it("throws if the variable has already been declared", () => {
  mocked(compiler.getSymbol).mockReturnValueOnce({
    label: "VAR1",
    type: "num"
  });

  expect(() => declareVariable(compiler, "num", "x")).toThrowError();

  expect(mocked(compiler.defineVariable)).not.toHaveBeenCalled();
});
