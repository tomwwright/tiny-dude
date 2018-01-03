import { comparer } from 'mobx/lib/types/comparer';

const SOURCE_SEPERATOR = ' ';
export const TOKEN_EOL = '[EOL]';
export const TOKEN_COMMENT = '//';

export enum Mnemonic {
  HLT = 'HLT',
  ADD = 'ADD',
  SUB = 'SUB',
  STA = 'STA',
  LDA = 'LDA',
  BRA = 'BRA',
  BRZ = 'BRZ',
  BRP = 'BRP',
  OUT = 'OUT',
  INP = 'INP',
  DAT = 'DAT',
}

export const OpCodes = {
  [Mnemonic.HLT]: 0,
  [Mnemonic.DAT]: 0,
  [Mnemonic.ADD]: 100,
  [Mnemonic.SUB]: 200,
  [Mnemonic.STA]: 400,
  [Mnemonic.LDA]: 500,
  [Mnemonic.BRA]: 600,
  [Mnemonic.BRZ]: 700,
  [Mnemonic.BRP]: 800,
  [Mnemonic.OUT]: 901,
  [Mnemonic.INP]: 902,
};

export type CompilerError = {
  message: string;
  line: number;
};

export type AssemblyCompilerOutput = {
  program: number[];
  errors: CompilerError[];
};

type AssemblyStatement = {
  line: number;
  label: string;
  instruction: Mnemonic;
  argument: string;
};

export type AssemblyParser = {
  tokens: string[];
  state: AssemblyParserState;
  line: number;
  statements: AssemblyStatement[];
  currentStatement: AssemblyStatement;
  errors: CompilerError[];
  fatalError: boolean;
};

export type AssemblyCompiler = {
  statements: AssemblyStatement[];
  program: number[];
  errors: CompilerError[];
};

export const enum AssemblyParserState {
  PROGRAM = 'program',
  COMMENT = 'comment',
  EOL = 'eol',
  STATEMENT = 'statement',
  INSTRUCTION = 'instruction',
  ARGUMENT = 'argument',
  ERROR_SYNTAX = 'error.syntax',
}

export const enum AssemblyToken {
  EOL = 'eol',
  COMMENT = 'comment',
  INSTRUCTION = 'instruction',
  LABEL = 'label',
  NUMBER = 'number',
}

export function compileAssembly(source: string): AssemblyCompilerOutput {
  if (source.charAt(source.length - 1) != '\n') source += '\n';

  const tokens = source
    .replace(/\n/g, SOURCE_SEPERATOR + TOKEN_EOL + SOURCE_SEPERATOR)
    .split(SOURCE_SEPERATOR)
    .filter(token => token.length > 0)
    .map(token => token.toUpperCase());

  const statements: AssemblyStatement[] = [];

  const parser: AssemblyParser = {
    tokens: tokens,
    state: AssemblyParserState.PROGRAM,
    line: 1,
    statements: [],
    errors: [],
    currentStatement: null,
    fatalError: false,
  };

  while (parser.tokens.length > 0 && !parser.fatalError) {
    parse(parser);
  }

  if (parser.errors.length > 0) {
    return {
      program: [],
      errors: parser.errors,
    };
  }

  const compiler: AssemblyCompiler = {
    statements: parser.statements,
    program: [],
    errors: [],
  };

  compile(compiler);

  return {
    program: compiler.program,
    errors: compiler.errors,
  };
}

export function parse(compiler: AssemblyParser) {
  const parser = parsers[compiler.state];
  if (!parser) {
    compiler.errors.push({
      line: compiler.line,
      message: `Compiler entered illegal state '${compiler.state}'`,
    });
    compiler.fatalError = true;
  } else {
    parser(compiler);
  }
}

const parsers: { [state: string]: (parser: AssemblyParser) => void } = {
  [AssemblyParserState.PROGRAM]: parseProgram,
  [AssemblyParserState.ERROR_SYNTAX]: parseComment,
  [AssemblyParserState.COMMENT]: parseComment,
  [AssemblyParserState.EOL]: parseEOL,
  [AssemblyParserState.STATEMENT]: parseStatement,
  [AssemblyParserState.INSTRUCTION]: parseInstruction,
  [AssemblyParserState.ARGUMENT]: parseArgument,
};

function parseEOL(compiler: AssemblyParser): void {
  const token = compiler.tokens[0];

  if (match(token, AssemblyToken.EOL)) {
    if (compiler.currentStatement) {
      compiler.statements.push(compiler.currentStatement);
      compiler.currentStatement = null;
    }
    compiler.line += 1;
    compiler.tokens.splice(0, 1);
    compiler.state = AssemblyParserState.PROGRAM;
  } else if (match(token, AssemblyToken.COMMENT)) {
    compiler.state = AssemblyParserState.COMMENT;
  } else {
    compiler.state = AssemblyParserState.ERROR_SYNTAX;
    compiler.errors.push({
      line: compiler.line,
      message: `Illegal token '${token}': expected EOL`,
    });
  }
}

function parseStatement(compiler: AssemblyParser) {
  compiler.currentStatement = {
    line: compiler.line,
    instruction: null,
    label: null,
    argument: null,
  };

  const token = compiler.tokens[0];
  if (match(token, AssemblyToken.INSTRUCTION)) {
    compiler.state = AssemblyParserState.INSTRUCTION;
  } else if (match(token, AssemblyToken.LABEL)) {
    compiler.state = AssemblyParserState.INSTRUCTION;
    compiler.currentStatement.label = token;
    compiler.tokens.splice(0, 1);
  } else {
    compiler.state = AssemblyParserState.ERROR_SYNTAX;
    compiler.currentStatement = null;
    compiler.errors.push({
      line: compiler.line,
      message: `Illegal token '${token}': expected LABEL|INSTRUCTION`,
    });
  }
}

function parseInstruction(compiler: AssemblyParser) {
  const token = compiler.tokens[0];
  if (match(token, AssemblyToken.INSTRUCTION)) {
    compiler.currentStatement.instruction = Mnemonic[token];
    compiler.state = AssemblyParserState.ARGUMENT;
    compiler.tokens.splice(0, 1);
  } else {
    compiler.state = AssemblyParserState.ERROR_SYNTAX;
    compiler.currentStatement = null;
    compiler.errors.push({
      line: compiler.line,
      message: `Illegal token '${token}': expected INSTRUCTION`,
    });
  }
}

function parseArgument(compiler: AssemblyParser) {
  const token = compiler.tokens[0];

  if (match(token, AssemblyToken.EOL)) {
    compiler.state = AssemblyParserState.EOL;
  } else if (match(token, AssemblyToken.COMMENT)) {
    compiler.state = AssemblyParserState.COMMENT;
  } else if (match(token, AssemblyToken.LABEL) || match(token, AssemblyToken.NUMBER)) {
    compiler.state = AssemblyParserState.EOL;
    compiler.tokens.splice(0, 1);
    compiler.currentStatement.argument = token;
  } else {
    compiler.state = AssemblyParserState.ERROR_SYNTAX;
    compiler.currentStatement = null;
    compiler.errors.push({
      line: compiler.line,
      message: `Illegal token '${token}': expected LABEL|NUMBER|EOL`,
    });
  }
}

function parseComment(compiler: AssemblyParser) {
  const token = compiler.tokens[0];
  if (match(token, AssemblyToken.EOL)) {
    compiler.state = AssemblyParserState.EOL;
  } else {
    compiler.tokens.splice(0, 1);
  }
}

function parseProgram(compiler: AssemblyParser) {
  const token = compiler.tokens[0];

  if (match(token, AssemblyToken.EOL)) {
    compiler.state = AssemblyParserState.EOL;
  } else if (match(token, AssemblyToken.COMMENT)) {
    compiler.state = AssemblyParserState.COMMENT;
  } else {
    compiler.state = AssemblyParserState.STATEMENT;
  }
}

export function match(token: string, type: AssemblyToken): boolean {
  switch (type) {
    case AssemblyToken.EOL:
      return matchEOL(token);
    case AssemblyToken.COMMENT:
      return matchComment(token);
    case AssemblyToken.INSTRUCTION:
      return matchInstruction(token);
    case AssemblyToken.LABEL:
      return matchLabel(token);
    case AssemblyToken.NUMBER:
      return matchNumber(token);
  }
  return false;
}

function matchEOL(token: string): boolean {
  return token == TOKEN_EOL;
}

function matchComment(token: string): boolean {
  return token == TOKEN_COMMENT;
}

function matchInstruction(token: string): boolean {
  const mnemonic = Mnemonic[token];
  return mnemonic != null;
}

function matchLabel(token: string): boolean {
  return /^[A-Z][A-Z0-9]*$/.test(token) && !matchInstruction(token);
}

function matchNumber(token: string): boolean {
  return /^([0-9]|[0-9]{2}|[0-9]{3})$/.test(token);
}

function compile(compiler: AssemblyCompiler) {
  compiler.program = [];
  const labelsToAddress: { [label: string]: number } = {};

  compiler.statements.forEach((statement, i) => {
    if (statement.label) {
      if (labelsToAddress[statement.label] === undefined) {
        labelsToAddress[statement.label] = i;
      } else {
        compiler.errors.push({
          line: statement.line,
          message: `Label already defined: ${statement.label}`,
        });
      }
    }

    switch (statement.instruction) {
      case Mnemonic.ADD:
      case Mnemonic.SUB:
      case Mnemonic.STA:
      case Mnemonic.LDA:
      case Mnemonic.BRA:
      case Mnemonic.BRZ:
      case Mnemonic.BRP:
      case Mnemonic.DAT:
        if (statement.argument == null) {
          compiler.errors.push({
            line: statement.line,
            message: `Missing argument for instruction: ${statement.instruction}`,
          });
        }
        break;
      case Mnemonic.HLT:
      case Mnemonic.INP:
      case Mnemonic.OUT:
        if (statement.argument != null) {
          compiler.errors.push({
            line: statement.line,
            message: `Argument specified for non-argument instruction: ${statement.instruction}`,
          });
        }
        break;
    }
  });

  compiler.statements.forEach((statement, i) => {
    if (statement.argument && matchLabel(statement.argument) && labelsToAddress[statement.argument] === undefined) {
      compiler.errors.push({
        line: statement.line,
        message: `Label not defined: ${statement.argument}`,
      });
    }
  });

  if (compiler.errors.length == 0) {
    compiler.statements.forEach((statement, i) => {
      let code = OpCodes[statement.instruction];
      if (statement.argument) {
        const argument = matchNumber(statement.argument)
          ? Number.parseInt(statement.argument)
          : labelsToAddress[statement.argument];
        code += argument;
      }
      compiler.program.push(code);
    });
  }
}
