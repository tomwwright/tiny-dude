import { mocked } from "ts-jest/utils";
import { TinyDudePlusCompiler } from "../../tinydudepluscompiler";
import { Mnemonic } from "../../assemblycompiler";
import { branch, branchIfPositive, branchIfZero } from "./branch";

jest.mock("../../tinydudepluscompiler");

let compiler: TinyDudePlusCompiler;

beforeEach(() => {
  mocked(TinyDudePlusCompiler).mockClear();
  compiler = new TinyDudePlusCompiler();

  mocked(compiler.allocateFlowLabel).mockReturnValueOnce("FLOW1");
});

describe("branch", () => {
  it("creates the correct branch instruction", () => {
    const label = branch(compiler);

    expect(mocked(compiler.allocateFlowLabel)).toHaveBeenCalled();
    expect(mocked(compiler.addAssemblyStatement)).toHaveBeenCalledWith({
      instruction: Mnemonic.BRA,
      argument: label
    });
  });

  it("uses a provided branch label", () => {
    const label = branch(compiler, "FLOWPROVIDED");

    expect(mocked(compiler.allocateFlowLabel)).not.toHaveBeenCalled();
    expect(mocked(compiler.addAssemblyStatement)).toHaveBeenCalledWith({
      instruction: Mnemonic.BRA,
      argument: "FLOWPROVIDED"
    });
  });
});

describe("branchIfPositive", () => {
  it("creates the correct branch instruction", () => {
    const label = branchIfPositive(compiler);

    expect(mocked(compiler.allocateFlowLabel)).toHaveBeenCalled();
    expect(mocked(compiler.addAssemblyStatement)).toHaveBeenCalledWith({
      instruction: Mnemonic.BRP,
      argument: label
    });
  });
});

describe("branchIfZero", () => {
  it("creates the correct branch instruction", () => {
    const label = branchIfZero(compiler);

    expect(mocked(compiler.allocateFlowLabel)).toHaveBeenCalled();
    expect(mocked(compiler.addAssemblyStatement)).toHaveBeenCalledWith({
      instruction: Mnemonic.BRZ,
      argument: label
    });
  });
});
