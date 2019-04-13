import { mocked } from "ts-jest/utils";
import { TinyDudePlusCompiler } from "../../tinydudepluscompiler";
import { AST } from "../types";
import { evaluateAssignment } from "./assignment";
import { storeAccumulator } from "../routines/storeAccumulator";

jest.mock("../routines/storeAccumulator");
jest.mock("../../tinydudepluscompiler");

it("evaluates the expression", () => {
  const evaluate = jest.fn();
  const compiler = new TinyDudePlusCompiler();
  const assignment: AST.Assignment = {
    node: "assignment",
    identifier: {
      node: "identifier",
      value: "x"
    },
    expression: {
      node: "boolean",
      value: true
    }
  };

  evaluateAssignment(compiler, assignment, evaluate);

  expect(evaluate).toHaveBeenCalledWith(assignment.expression);
  expect(storeAccumulator).toHaveBeenCalledWith(compiler, "x");
});
