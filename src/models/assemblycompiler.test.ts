import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';

import {
  AssemblyToken,
  AssemblyParser,
  AssemblyParserState,
  match,
  parse,
  TOKEN_EOL,
  TOKEN_COMMENT,
  Mnemonic,
  compileAssembly,
} from 'models/assemblycompiler';

const VALID_EOL = '[EOL]';
const VALID_COMMENT = '//';
const VALID_INSTRUCTIONS = ['HLT', 'ADD', 'OUT', 'BRA'];
const VALID_LABELS = ['MYVAR', 'VAR1', 'TEST', 'MYVAR2WOO'];
const INVALID_LABELS = ['abc', 'HLT', 'ADD', '1VAR', 'MY_VAR'];
const VALID_NUMBERS = ['06', '51', '99', '00', '203', '999'];

describe('match()', () => {
  describe(AssemblyToken.EOL, () => {
    it('matches valid EOL', () => {
      expect(match(VALID_EOL, AssemblyToken.EOL)).to.be.true;
    });
    it('no match on other strings', () => {
      expect(match(VALID_COMMENT, AssemblyToken.EOL)).to.be.false;
      for (const instruction of VALID_INSTRUCTIONS) expect(match(instruction, AssemblyToken.EOL)).to.be.false;
      for (const number of VALID_NUMBERS) expect(match(number, AssemblyToken.EOL)).to.be.false;
    });
  });

  describe(AssemblyToken.COMMENT, () => {
    it('matches valid comment start', () => {
      expect(match(VALID_COMMENT, AssemblyToken.COMMENT)).to.be.true;
    });
    it('no match on other strings', () => {
      expect(match(VALID_EOL, AssemblyToken.COMMENT)).to.be.false;
      for (const instruction of VALID_INSTRUCTIONS) expect(match(instruction, AssemblyToken.COMMENT)).to.be.false;
      for (const number of VALID_NUMBERS) expect(match(number, AssemblyToken.COMMENT)).to.be.false;
    });
  });

  describe(AssemblyToken.INSTRUCTION, () => {
    it('matches valid instruction examples', () => {
      for (const instruction of VALID_INSTRUCTIONS)
        expect(match(instruction, AssemblyToken.INSTRUCTION), `matches ${instruction}`).to.be.true;
    });
    it('no match on other strings', () => {
      expect(match(VALID_EOL, AssemblyToken.INSTRUCTION)).to.be.false;
      expect(match(VALID_COMMENT, AssemblyToken.INSTRUCTION)).to.be.false;
      for (const label of VALID_LABELS) expect(match(label, AssemblyToken.INSTRUCTION)).to.be.false;
      for (const number of VALID_NUMBERS) expect(match(number, AssemblyToken.INSTRUCTION)).to.be.false;
    });
  });

  describe(AssemblyToken.LABEL, () => {
    it('matches valid label examples', () => {
      for (const label of VALID_LABELS) expect(match(label, AssemblyToken.LABEL)).to.be.true;
    });
    it('no match on other strings', () => {
      expect(match(VALID_EOL, AssemblyToken.LABEL)).to.be.false;
      expect(match(VALID_COMMENT, AssemblyToken.LABEL)).to.be.false;
      for (const label of INVALID_LABELS) expect(match(label, AssemblyToken.LABEL)).to.be.false;
      for (const number of VALID_NUMBERS) expect(match(number, AssemblyToken.LABEL)).to.be.false;
    });
  });

  describe(AssemblyToken.NUMBER, () => {
    it('matches valid number examples', () => {
      for (const number of VALID_NUMBERS) expect(match(number, AssemblyToken.NUMBER)).to.be.true;
    });
    it('no match on other strings', () => {
      expect(match(VALID_EOL, AssemblyToken.NUMBER)).to.be.false;
      expect(match(VALID_COMMENT, AssemblyToken.NUMBER)).to.be.false;
      for (const label of INVALID_LABELS) expect(match(label, AssemblyToken.NUMBER)).to.be.false;
    });
  });
});

describe('parse', () => {
  let compiler: AssemblyParser = {
    line: 1,
    errors: [],
    currentStatement: null,
    statements: [],
    tokens: [],
    state: AssemblyParserState.EOL,
    fatalError: false,
  };

  describe('Program', () => {
    beforeEach(() => {
      compiler.tokens = [];
      compiler.line = 1;
      compiler.state = AssemblyParserState.PROGRAM;
      compiler.errors = [];
    });

    it('move to EOL state', () => {
      compiler.tokens = [TOKEN_EOL];

      parse(compiler);

      expect(compiler.errors, 'no compile errors').to.have.lengthOf(0);
      expect(compiler.state, 'moved to EOL state').to.equal(AssemblyParserState.EOL);
      expect(compiler.tokens, 'token not consumed').to.have.members([TOKEN_EOL]);
      expect(compiler.line, 'line not incremented').to.equal(1);
    });

    it('move to comment state', () => {
      compiler.tokens = [TOKEN_COMMENT, 'here', 'is', 'a', 'comment', TOKEN_EOL];

      parse(compiler);

      expect(compiler.errors, 'no compile errors').to.have.lengthOf(0);
      expect(compiler.state, 'moved to comment state').to.equal(AssemblyParserState.COMMENT);
      expect(compiler.tokens, 'token not consumed').to.have.lengthOf(6);
      expect(compiler.line, 'line not incremented').to.equal(1);
    });

    it('move to statement state', () => {
      compiler.tokens = ['LABEL', 'ADD', '56'];

      parse(compiler);

      expect(compiler.errors, 'no compile errors').to.have.lengthOf(0);
      expect(compiler.state, 'moved to statement state').to.equal(AssemblyParserState.STATEMENT);
      expect(compiler.tokens, 'token not consumed').to.have.lengthOf(3);
      expect(compiler.line, 'line not incremented').to.equal(1);
    });
  });

  describe('EOL', () => {
    beforeEach(() => {
      compiler.tokens = [];
      compiler.line = 1;
      compiler.state = AssemblyParserState.EOL;
      compiler.errors = [];
    });

    it('parse EOL token', () => {
      compiler.tokens = [TOKEN_EOL, 'NEXT'];

      parse(compiler);

      expect(compiler.errors, 'no compile errors').to.have.lengthOf(0);
      expect(compiler.state, 'moved to PROGRAM state').to.equal(AssemblyParserState.PROGRAM);
      expect(compiler.tokens, 'moved to next token').to.have.members(['NEXT']);
      expect(compiler.line, 'line incremented').to.equal(2);
    });

    it('parse bad token', () => {
      compiler.tokens = ['BAD', 'NEXT'];

      parse(compiler);

      expect(compiler.errors, 'compile errors').to.have.lengthOf(1);
      expect(compiler.state, 'moved to ERROR_SYNTAX state').to.equal(AssemblyParserState.ERROR_SYNTAX);
      expect(compiler.tokens, 'token not consumed').to.have.members(['BAD', 'NEXT']);
      expect(compiler.line, 'line the same').to.equal(1);
    });
  });

  describe('Comment', () => {
    beforeEach(() => {
      compiler.tokens = [];
      compiler.line = 1;
      compiler.state = AssemblyParserState.COMMENT;
      compiler.errors = [];
    });

    it('parse tokens until EOL', () => {
      compiler.tokens = [TOKEN_COMMENT, 'here', 'are', 'some', 'tokens', TOKEN_EOL];

      parse(compiler);
      parse(compiler);
      parse(compiler);
      parse(compiler);
      parse(compiler);
      parse(compiler);

      expect(compiler.errors, 'no compile errors').to.have.lengthOf(0);
      expect(compiler.state, 'moved to EOL state').to.equal(AssemblyParserState.EOL);
      expect(compiler.tokens, 'consumed tokens').to.have.members([TOKEN_EOL]);
      expect(compiler.line, 'line not incremented').to.equal(1);
    });
  });

  describe('Statement', () => {
    beforeEach(() => {
      compiler.tokens = [];
      compiler.line = 1;
      compiler.state = AssemblyParserState.STATEMENT;
      compiler.errors = [];
      compiler.currentStatement = {
        line: 1,
        label: 'LABEL',
        instruction: null,
        argument: null,
      };
    });

    it('parse label', () => {
      compiler.tokens = ['LABEL', 'ADD', '123', TOKEN_EOL];

      parse(compiler);

      expect(compiler.errors, 'no compile errors').to.have.lengthOf(0);
      expect(compiler.state, 'moved to Instruction state').to.equal(AssemblyParserState.INSTRUCTION);
      expect(compiler.tokens, 'consumed tokens').to.have.members(['ADD', '123', TOKEN_EOL]);
      expect(compiler.currentStatement, 'statement initialised').to.not.be.null;
      expect(compiler.currentStatement.label, 'label on current statement').to.be.equal('LABEL');
      expect(compiler.line, 'line not incremented').to.equal(1);
    });

    it('parse no label', () => {
      compiler.tokens = ['ADD', '123', TOKEN_EOL];

      parse(compiler);

      expect(compiler.errors, 'no compile errors').to.have.lengthOf(0);
      expect(compiler.state, 'moved to Instruction state').to.equal(AssemblyParserState.INSTRUCTION);
      expect(compiler.tokens, 'no consumed tokens').to.have.members(['ADD', '123', TOKEN_EOL]);
      expect(compiler.currentStatement, 'statement initialised').to.not.be.null;
      expect(compiler.currentStatement.label, 'no label initialised').to.be.null;
      expect(compiler.line, 'line not incremented').to.equal(1);
    });

    it('bad label', () => {
      compiler.tokens = ['123', 'ADD', '123', TOKEN_EOL];

      parse(compiler);

      expect(compiler.errors, 'compile error').to.have.lengthOf(1);
      expect(compiler.state, 'moved to Syntax Error state').to.equal(AssemblyParserState.ERROR_SYNTAX);
      expect(compiler.tokens, 'no consumed tokens').to.have.members(['123', 'ADD', '123', TOKEN_EOL]);
      expect(compiler.currentStatement, 'statement not initialised').to.be.null;
      expect(compiler.line, 'line not incremented').to.equal(1);
    });
  });

  describe('Instruction', () => {
    beforeEach(() => {
      compiler.tokens = [];
      compiler.line = 1;
      compiler.state = AssemblyParserState.INSTRUCTION;
      compiler.currentStatement = {
        line: 1,
        label: 'LABEL',
        instruction: null,
        argument: null,
      };
      compiler.errors = [];
    });

    it('parse instruction', () => {
      compiler.tokens = ['ADD', '123', TOKEN_EOL];

      parse(compiler);

      expect(compiler.errors, 'no compile errors').to.have.lengthOf(0);
      expect(compiler.state, 'moved to Argument state').to.equal(AssemblyParserState.ARGUMENT);
      expect(compiler.tokens, 'consumed tokens').to.have.members(['123', TOKEN_EOL]);
      expect(compiler.currentStatement.instruction, 'instruction initialised').to.be.equal('ADD');
      expect(compiler.line, 'line not incremented').to.equal(1);
    });

    it('bad instruction', () => {
      compiler.tokens = ['BAD', '123', TOKEN_EOL];

      parse(compiler);

      expect(compiler.errors, 'compile errors').to.have.lengthOf(1);
      expect(compiler.state, 'moved to Syntax Error state').to.equal(AssemblyParserState.ERROR_SYNTAX);
      expect(compiler.tokens, 'consumed tokens').to.have.members(['BAD', '123', TOKEN_EOL]);
      expect(compiler.currentStatement, 'statement not initialised').to.be.null;
      expect(compiler.line, 'line not incremented').to.equal(1);
    });
  });

  describe('Argument', () => {
    beforeEach(() => {
      compiler.tokens = [];
      compiler.line = 1;
      compiler.state = AssemblyParserState.ARGUMENT;
      compiler.errors = [];
      compiler.currentStatement = {
        line: 1,
        label: 'LABEL',
        instruction: Mnemonic.ADD,
        argument: null,
      };
    });

    it('parse label argument', () => {
      compiler.tokens = ['LABEL', TOKEN_EOL];

      parse(compiler);

      expect(compiler.errors, 'no compile errors').to.have.lengthOf(0);
      expect(compiler.state, 'moved to EOL state').to.equal(AssemblyParserState.EOL);
      expect(compiler.tokens, 'consumed tokens').to.have.members([TOKEN_EOL]);
      expect(compiler.currentStatement.argument).to.be.equal('LABEL');
      expect(compiler.line, 'line not incremented').to.equal(1);
    });

    it('parse number argument', () => {
      compiler.tokens = ['123', TOKEN_EOL];

      parse(compiler);

      expect(compiler.errors, 'no compile errors').to.have.lengthOf(0);
      expect(compiler.state, 'moved to EOL state').to.equal(AssemblyParserState.EOL);
      expect(compiler.tokens, 'consumed tokens').to.have.members([TOKEN_EOL]);
      expect(compiler.currentStatement.argument).to.be.equal('123');
      expect(compiler.line, 'line not incremented').to.equal(1);
    });

    it('parse no argument', () => {
      compiler.tokens = [TOKEN_EOL];

      parse(compiler);

      expect(compiler.errors, 'no compile errors').to.have.lengthOf(0);
      expect(compiler.state, 'moved to EOL state').to.equal(AssemblyParserState.EOL);
      expect(compiler.tokens, 'no consumed tokens').to.have.members([TOKEN_EOL]);
      expect(compiler.currentStatement.argument).to.be.null;
      expect(compiler.line, 'line not incremented').to.equal(1);
    });

    it('bad argument', () => {
      compiler.tokens = ['ADD'];

      parse(compiler);

      expect(compiler.errors, 'compile errors').to.have.lengthOf(1);
      expect(compiler.state, 'moved to Syntax Error state').to.equal(AssemblyParserState.ERROR_SYNTAX);
      expect(compiler.tokens, 'no consumed tokens').to.have.members(['ADD']);
      expect(compiler.currentStatement).to.be.null;
      expect(compiler.line, 'line not incremented').to.equal(1);
    });
  });
});

describe('compile source', () => {
  it('valid source: count to zero', () => {
    const source =
      'INP\n\
      OUT      // Initialize output\n\
 LOOP BRZ QUIT // If the accumulator value is 0, jump to the memory address labeled QUIT\n\
      SUB ONE  // Label this memory address as LOOP, The instruction will then subtract the value stored at address ONE from the accumulator\n\
      OUT\n\
      BRA LOOP // Jump (unconditionally) to the memory address labeled LOOP\n\
 QUIT HLT      // Label this memory address as QUIT\n\
 ONE  DAT 1    // Store the value 1 in this memory address, and label it ONE (variable declaration)\n\
      ';

    const output = compileAssembly(source);

    const expectedProgram = [902, 901, 706, 207, 901, 602, 0, 1];
    expect(output.errors, 'compile errors').to.have.lengthOf(0);
    expect(output.program, 'program output').to.have.members(expectedProgram);
  });

  it('valid source: square and output', () => {
    const source =
      'START   LDA ZERO     // Initialize for multiple program run\n\
      STA RESULT\n\
      STA COUNT\n\
      INP          // User provided input\n\
      BRZ END      // Branch to program END if input = 0\n\
      STA VALUE    // Store input as VALUE\n\
LOOP  LDA RESULT   // Load the RESULT\n\
      ADD VALUE    // Add VALUE, the user provided input, to RESULT\n\
      STA RESULT   // Store the new RESULT\n\
      LDA COUNT    // Load the COUNT\n\
      ADD ONE      // Add ONE to the COUNT\n\
      STA COUNT    // Store the new COUNT\n\
      SUB VALUE    // Subtract the user provided input VALUE from COUNT\n\
      BRZ ENDLOOP  // If zero (VALUE has been added to RESULT by VALUE times), branch to ENDLOOP\n\
      BRA LOOP     // Branch to LOOP to continue adding VALUE to RESULT\n\
ENDLOOP LDA RESULT   // Load RESULT\n\
      OUT          // Output RESULT\n\
      BRA START    // Branch to the START to initialize and get another input VALUE\n\
END   HLT          // HALT - a zero was entered so done!\n\
RESULT  DAT 0          // Computed result (defaults to 0)\n\
COUNT DAT 0        // Counter (defaults to 0)\n\
ONE   DAT 1        // Constant, value of 1\n\
VALUE DAT 0        // User provided input, the value to be squared (defaults to 0)\n\
ZERO  DAT 0        // Constant, value of 0 (defaults to 0)\n';

    const output = compileAssembly(source);

    const expectedProgram = [
      523,
      419,
      420,
      902,
      718,
      422,
      519,
      122,
      419,
      520,
      121,
      420,
      222,
      715,
      606,
      519,
      901,
      600,
      0,
      0,
      1,
      0,
      0,
    ];

    expect(output.errors, 'compile errors').to.have.lengthOf(0);
    expect(output.program, 'program output').to.have.members(expectedProgram);
  });
});
