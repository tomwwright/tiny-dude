import { mocked } from "ts-jest/utils";
import { TinyDudePlusCompiler } from "../../tinydudepluscompiler";
import { AST } from "../types";
import { evaluateDeclaration } from "./declaration";
import { declareVariable } from "../routines/declareVariable";

jest.mock("../routines/declareVariable");
jest.mock("../../tinydudepluscompiler");

it("declares a variable", () => {
  const evaluate = jest.fn();
  const compiler = new TinyDudePlusCompiler();
  const declaration: AST.Declaration = {
    node: "declaration",
    type: "num",
    declaration: {
      node: "identifier",
      value: "x"
    }
  };

  evaluateDeclaration(compiler, declaration, evaluate);

  expect(declareVariable).toHaveBeenCalledWith(compiler, "num", "x");
  expect(evaluate).not.toHaveBeenCalled();
});

it("evaluates an assignment if one exists", () => {
  const evaluate = jest.fn();
  const compiler = new TinyDudePlusCompiler();
  const declaration: AST.Declaration = {
    node: "declaration",
    type: "num",
    declaration: {
      node: "assignment",
      identifier: {
        node: "identifier",
        value: "x"
      },
      expression: {
        node: "number",
        value: 3
      }
    }
  };

  evaluateDeclaration(compiler, declaration, evaluate);

  expect(declareVariable).toHaveBeenCalledWith(compiler, "num", "x");
  expect(evaluate).toHaveBeenCalledWith(declaration.declaration);
});
