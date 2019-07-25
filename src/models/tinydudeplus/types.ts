import { TinyDudePlusCompiler } from "../tinydudepluscompiler";

export type Evaluate = (compiler: TinyDudePlusCompiler, node: AST.Node, evaluate: (node: AST.Node) => void) => void;

export namespace AST {
  export type SyntaxError = {
    expected: any;
    found: string;
    location: {
      start: SourceLocation;
      end: SourceLocation;
    };
    message: string;
    name: string;
    stack: string;
  };

  type SourceLocation = {
    offset: number;
    line: number;
    column: number;
  };

  export type Node = Program | Statement | Expression;

  export type BaseNode = {
    node: string;
    location?: {
      start: SourceLocation;
      end: SourceLocation;
    } & (Program | Statement | Expression);
  };

  export type Program = BaseNode & {
    node: "program";
    statements: Statement[];
  };

  type Statement = Block | Out | Declaration | Assignment;

  export type Out = BaseNode & {
    node: "out";
    expression: Expression;
  };

  export type Block = BaseNode & {
    node: "if" | "loop";
    expression: Expression;
    statements: Statement[];
  };

  export type Declaration = BaseNode & {
    node: "declaration";
    type: Type;
    declaration: IdentifierTerm | Assignment;
  };

  export type Assignment = BaseNode & {
    node: "assignment";
    identifier: IdentifierTerm;
    expression: Expression;
  };

  export type Expression = Term | BracketsExpression | UnaryExpression | BinaryExpression;

  export type BracketsExpression = BaseNode & {
    node: "brackets";
    expression: Expression;
  };

  export type UnaryExpression = BaseNode & {
    node: "unary";
    operator: UnaryOperator;
    expression: Expression;
  };

  export type BinaryExpression = BaseNode & {
    node: "binary";
    operator: BinaryOperator;
    left: Expression;
    right: Expression;
  };

  export type Type = "num" | "bool";
  type BinaryOperator = ">=" | "<=" | "==" | "and" | "or" | "+" | "-" | "*" | "/" | "%";
  type UnaryOperator = "not";

  export type Term = IdentifierTerm | NumberTerm | BooleanTerm;

  export type IdentifierTerm = BaseNode & {
    node: "identifier";
    value: string;
  };

  export type NumberTerm = BaseNode & {
    node: "number";
    value: number;
  };

  export type BooleanTerm = BaseNode & {
    node: "boolean";
    value: boolean;
  };
}
