import { TinyDudePlusCompiler } from "../tinydudepluscompiler";

export type Evaluate = (compiler: TinyDudePlusCompiler, node: AST.Node, evaluate: (node: AST.Node) => void) => void;

export namespace AST {
  export type Program = {
    node: "program";
    statements: Statement[];
  };

  export type Node = Program | Statement | Expression;

  type Statement = Block | Out | Declaration | Assignment;

  export type Out = {
    node: "out";
    expression: Expression;
  };

  export type Block = {
    node: "if" | "loop";
    expression: Expression;
    statements: Statement[];
  };

  export type Declaration = {
    node: "declaration";
    type: Type;
    declaration: IdentifierTerm | Assignment;
  };

  export type Assignment = {
    node: "assignment";
    identifier: IdentifierTerm;
    expression: Expression;
  };

  export type Expression = Term | BracketsExpression | UnaryExpression | BinaryExpression;

  export type BracketsExpression = {
    node: "brackets";
    expression: Expression;
  };

  export type UnaryExpression = {
    node: "unary";
    operator: UnaryOperator;
    expression: Expression;
  };

  export type BinaryExpression = {
    node: "binary";
    operator: BinaryOperator;
    left: Expression;
    right: Expression;
  };

  export type Type = "num" | "bool";
  type BinaryOperator = ">" | "<" | "==" | "and" | "or" | "+" | "-" | "*" | "/" | "%";
  type UnaryOperator = "not";

  export type Term = IdentifierTerm | NumberTerm | BooleanTerm;

  export type IdentifierTerm = {
    node: "identifier";
    value: string;
  };

  export type NumberTerm = {
    node: "number";
    value: number;
  };

  export type BooleanTerm = {
    node: "boolean";
    value: boolean;
  };
}
