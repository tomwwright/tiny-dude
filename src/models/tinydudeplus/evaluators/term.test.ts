import { mocked } from "ts-jest/utils";
import { TinyDudePlusCompiler } from "../../tinydudepluscompiler";
import { AST } from "../types";
import { evaluateNumber, evaluateBoolean, evaluateIdentifier } from "./term";
import { loadAccumulator, loadAccumulatorConstant } from "../routines/loadAccumulator";

jest.mock("../routines/loadAccumulator");

it("loads a number constant", () => {
  const compiler = new TinyDudePlusCompiler();
  const number: AST.NumberTerm = {
    node: "number",
    value: 3
  };

  evaluateNumber(compiler, number);

  expect(loadAccumulatorConstant).toHaveBeenCalledWith(compiler, 3);
});

it("loads a boolean constant - true", () => {
  const compiler = new TinyDudePlusCompiler();
  const boolean: AST.BooleanTerm = {
    node: "boolean",
    value: true
  };

  evaluateBoolean(compiler, boolean);

  expect(loadAccumulatorConstant).toHaveBeenCalledWith(compiler, 1);
});

it("loads a boolean constant - false", () => {
  const compiler = new TinyDudePlusCompiler();
  const boolean: AST.BooleanTerm = {
    node: "boolean",
    value: false
  };

  evaluateBoolean(compiler, boolean);

  expect(loadAccumulatorConstant).toHaveBeenCalledWith(compiler, 0);
});

it("loads a variable", () => {
  const compiler = new TinyDudePlusCompiler();
  const identifier: AST.IdentifierTerm = {
    node: "identifier",
    value: "x"
  };

  evaluateIdentifier(compiler, identifier);

  expect(loadAccumulator).toHaveBeenCalledWith(compiler, "x");
});
