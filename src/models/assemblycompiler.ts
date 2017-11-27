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

export type AssemblyCompiler = {
  tokens: string[];
  state: AssemblyCompilerState;
  line: number;
  statements: AssemblyStatement[];
  currentStatement: AssemblyStatement;
  errors: CompilerError[];
  fatalError: boolean;
};

export const enum AssemblyCompilerState {
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
  const tokens = source
    .replace(/\n/g, SOURCE_SEPERATOR + TOKEN_EOL + SOURCE_SEPERATOR)
    .split(SOURCE_SEPERATOR)
    .filter(token => token.length > 0);

  const statements: AssemblyStatement[] = [];

  const compiler: AssemblyCompiler = {
    tokens: tokens,
    state: AssemblyCompilerState.PROGRAM,
    line: 1,
    statements: [],
    errors: [],
    currentStatement: null,
    fatalError: false,
  };

  while (compiler.tokens.length > 0 && !compiler.fatalError) {
    parse(compiler);
  }

  return {
    program: [],
    errors: compiler.errors,
  };
}

export function parse(compiler: AssemblyCompiler) {
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

const parsers: { [state: string]: (parser: AssemblyCompiler) => void } = {
  [AssemblyCompilerState.PROGRAM]: parseProgram,
  [AssemblyCompilerState.ERROR_SYNTAX]: parseComment,
  [AssemblyCompilerState.COMMENT]: parseComment,
  [AssemblyCompilerState.EOL]: parseEOL,
  [AssemblyCompilerState.STATEMENT]: parseStatement,
  [AssemblyCompilerState.INSTRUCTION]: parseInstruction,
  [AssemblyCompilerState.ARGUMENT]: parseArgument,
};

function parseEOL(compiler: AssemblyCompiler): void {
  const token = compiler.tokens[0];

  if (match(token, AssemblyToken.EOL)) {
    compiler.line += 1;
    compiler.tokens.splice(0, 1);
    compiler.state = AssemblyCompilerState.PROGRAM;
  } else {
    compiler.state = AssemblyCompilerState.ERROR_SYNTAX;
    compiler.errors.push({
      line: compiler.line,
      message: `Illegal token '${token}': expected EOL`,
    });
  }
}

function parseStatement(compiler: AssemblyCompiler) {
  compiler.currentStatement = {
    line: compiler.line,
    instruction: null,
    label: null,
    argument: null,
  };

  const token = compiler.tokens[0];
  if (match(token, AssemblyToken.INSTRUCTION)) {
    compiler.state = AssemblyCompilerState.INSTRUCTION;
  } else if (match(token, AssemblyToken.LABEL)) {
    compiler.state = AssemblyCompilerState.INSTRUCTION;
    compiler.currentStatement.label = token;
    compiler.tokens.splice(0, 1);
  } else {
    compiler.state = AssemblyCompilerState.ERROR_SYNTAX;
    compiler.errors.push({
      line: compiler.line,
      message: `Illegal token '${token}': expected LABEL|INSTRUCTION`,
    });
  }
}

function parseInstruction(compiler: AssemblyCompiler) {
  const token = compiler.tokens[0];
  if (match(token, AssemblyToken.INSTRUCTION)) {
    compiler.currentStatement.instruction = Mnemonic[token];
    compiler.state = AssemblyCompilerState.ARGUMENT;
    compiler.tokens.splice(0, 1);
  } else {
    compiler.state = AssemblyCompilerState.ERROR_SYNTAX;
    compiler.errors.push({
      line: compiler.line,
      message: `Illegal token '${token}': expected INSTRUCTION`,
    });
  }
}

function parseArgument(compiler: AssemblyCompiler) {
  const token = compiler.tokens[0];

  if (match(token, AssemblyToken.EOL)) {
    compiler.state = AssemblyCompilerState.EOL;
  } else if (match(token, AssemblyToken.LABEL) || match(token, AssemblyToken.NUMBER)) {
    compiler.state = AssemblyCompilerState.EOL;
    compiler.tokens.splice(0, 1);
    compiler.currentStatement.argument = token;
  } else {
    compiler.state = AssemblyCompilerState.ERROR_SYNTAX;
    compiler.errors.push({
      line: compiler.line,
      message: `Illegal token '${token}': expected LABEL|NUMBER|EOL`,
    });
  }
}

function parseComment(compiler: AssemblyCompiler) {
  const token = compiler.tokens[0];
  if (match(token, AssemblyToken.EOL)) {
    compiler.state = AssemblyCompilerState.EOL;
  } else {
    compiler.tokens.splice(0, 1);
  }
}

function parseProgram(compiler: AssemblyCompiler) {
  const token = compiler.tokens[0];

  if (match(token, AssemblyToken.EOL)) {
    compiler.state = AssemblyCompilerState.EOL;
  } else if (match(token, AssemblyToken.COMMENT)) {
    compiler.state = AssemblyCompilerState.COMMENT;
  } else {
    compiler.state = AssemblyCompilerState.STATEMENT;
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
