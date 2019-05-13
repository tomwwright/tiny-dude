import { TinyDudePlusCompiler } from "../tinydudepluscompiler";

export type Evaluate = (compiler: TinyDudePlusCompiler, node: AST.Node, evaluate: (node: AST.Node) => void) => void;

export namespace AST {
  type SourceLocation = {
    offset: number;
    line: number;
    column: number;
  };

  export type Node = {
    node: string;
    location?: {
      start: SourceLocation;
      end: SourceLocation;
    };
  };

  export type Program = Node & {
    node: "program";
    statements: Statement[];
  };

  type Statement = Block | Out | Declaration | Assignment;

  export type Out = Node & {
    node: "out";
    expression: Expression;
  };

  export type Block = Node & {
    node: "if" | "loop";
    expression: Expression;
    statements: Statement[];
  };

  export type Declaration = Node & {
    node: "declaration";
    type: Type;
    declaration: IdentifierTerm | Assignment;
  };

  export type Assignment = Node & {
    node: "assignment";
    identifier: IdentifierTerm;
    expression: Expression;
  };

  export type Expression = Term | BracketsExpression | UnaryExpression | BinaryExpression;

  export type BracketsExpression = Node & {
    node: "brackets";
    expression: Expression;
  };

  export type UnaryExpression = Node & {
    node: "unary";
    operator: UnaryOperator;
    expression: Expression;
  };

  export type BinaryExpression = Node & {
    node: "binary";
    operator: BinaryOperator;
    left: Expression;
    right: Expression;
  };

  export type Type = "num" | "bool";
  type BinaryOperator = ">=" | "<=" | "==" | "and" | "or" | "+" | "-" | "*" | "/" | "%";
  type UnaryOperator = "not";

  export type Term = IdentifierTerm | NumberTerm | BooleanTerm;

  export type IdentifierTerm = Node & {
    node: "identifier";
    value: string;
  };

  export type NumberTerm = Node & {
    node: "number";
    value: number;
  };

  export type BooleanTerm = Node & {
    node: "boolean";
    value: boolean;
  };
}
