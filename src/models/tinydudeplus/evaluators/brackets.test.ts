import { evaluateBrackets } from "./brackets";
import { AST } from "../types";
import { TinyDudePlusCompiler } from "../../tinydudepluscompiler";

it("evaluates the inside expression", () => {
  const evaluate = jest.fn();
  const compiler = new TinyDudePlusCompiler();
  const brackets: AST.BracketsExpression = {
    node: "brackets",
    expression: {
      node: "identifier",
      value: "x"
    }
  };

  evaluateBrackets(compiler, brackets, evaluate);

  expect(evaluate).toHaveBeenCalledWith(brackets.expression);
});
