import { AssemblyToken, AssemblyParser, AssemblyParserState, match, parse, TOKEN_EOL, TOKEN_COMMENT, Mnemonic, compileAssembly } from "./assemblycompiler";

const VALID_EOL = "[EOL]";
const VALID_COMMENT = "//";
const VALID_INSTRUCTIONS = ["HLT", "ADD", "OUT", "BRA"];
const VALID_LABELS = ["MYVAR", "VAR1", "TEST", "MYVAR2WOO"];
const INVALID_LABELS = ["abc", "HLT", "ADD", "1VAR", "MY_VAR"];
const VALID_NUMBERS = ["06", "51", "99", "00", "203", "999"];

describe("match()", () => {
  describe(AssemblyToken.EOL, () => {
    it("matches valid EOL", () => {
      expect(match(VALID_EOL, AssemblyToken.EOL)).toBeTruthy();
    });
    it("no match on other strings", () => {
      expect(match(VALID_COMMENT, AssemblyToken.EOL)).toBeFalsy();
      for (const instruction of VALID_INSTRUCTIONS) expect(match(instruction, AssemblyToken.EOL)).toBeFalsy();
      for (const number of VALID_NUMBERS) expect(match(number, AssemblyToken.EOL)).toBeFalsy();
    });
  });

  describe(AssemblyToken.COMMENT, () => {
    it("matches valid comment start", () => {
      expect(match(VALID_COMMENT, AssemblyToken.COMMENT)).toBeTruthy();
    });
    it("no match on other strings", () => {
      expect(match(VALID_EOL, AssemblyToken.COMMENT)).toBeFalsy();
      for (const instruction of VALID_INSTRUCTIONS) expect(match(instruction, AssemblyToken.COMMENT)).toBeFalsy();
      for (const number of VALID_NUMBERS) expect(match(number, AssemblyToken.COMMENT)).toBeFalsy();
    });
  });

  describe(AssemblyToken.INSTRUCTION, () => {
    it("matches valid instruction examples", () => {
      for (const instruction of VALID_INSTRUCTIONS) expect(match(instruction, AssemblyToken.INSTRUCTION)).toBeTruthy();
    });
    it("no match on other strings", () => {
      expect(match(VALID_EOL, AssemblyToken.INSTRUCTION)).toBeFalsy();
      expect(match(VALID_COMMENT, AssemblyToken.INSTRUCTION)).toBeFalsy();
      for (const label of VALID_LABELS) expect(match(label, AssemblyToken.INSTRUCTION)).toBeFalsy();
      for (const number of VALID_NUMBERS) expect(match(number, AssemblyToken.INSTRUCTION)).toBeFalsy();
    });
  });

  describe(AssemblyToken.LABEL, () => {
    it("matches valid label examples", () => {
      for (const label of VALID_LABELS) expect(match(label, AssemblyToken.LABEL)).toBeTruthy();
    });
    it("no match on other strings", () => {
      expect(match(VALID_EOL, AssemblyToken.LABEL)).toBeFalsy();
      expect(match(VALID_COMMENT, AssemblyToken.LABEL)).toBeFalsy();
      for (const label of INVALID_LABELS) expect(match(label, AssemblyToken.LABEL)).toBeFalsy();
      for (const number of VALID_NUMBERS) expect(match(number, AssemblyToken.LABEL)).toBeFalsy();
    });
  });

  describe(AssemblyToken.NUMBER, () => {
    it("matches valid number examples", () => {
      for (const number of VALID_NUMBERS) expect(match(number, AssemblyToken.NUMBER)).toBeTruthy();
    });
    it("no match on other strings", () => {
      expect(match(VALID_EOL, AssemblyToken.NUMBER)).toBeFalsy();
      expect(match(VALID_COMMENT, AssemblyToken.NUMBER)).toBeFalsy();
      for (const label of INVALID_LABELS) expect(match(label, AssemblyToken.NUMBER)).toBeFalsy();
    });
  });
});

describe("parse", () => {
  let compiler: AssemblyParser = {
    line: 1,
    errors: [],
    currentStatement: null,
    statements: [],
    tokens: [],
    state: AssemblyParserState.EOL,
    fatalError: false
  };

  describe("Program", () => {
    beforeEach(() => {
      compiler.tokens = [];
      compiler.line = 1;
      compiler.state = AssemblyParserState.PROGRAM;
      compiler.errors = [];
    });

    it("move to EOL state", () => {
      compiler.tokens = [TOKEN_EOL];

      parse(compiler);

      expect(compiler.errors).toHaveLength(0);
      expect(compiler.state).toEqual(AssemblyParserState.EOL);
      expect(compiler.tokens).toEqual(expect.arrayContaining([TOKEN_EOL]));
      expect(compiler.line).toEqual(1);
    });

    it("move to comment state", () => {
      compiler.tokens = [TOKEN_COMMENT, "here", "is", "a", "comment", TOKEN_EOL];

      parse(compiler);

      expect(compiler.errors).toHaveLength(0);
      expect(compiler.state).toEqual(AssemblyParserState.COMMENT);
      expect(compiler.tokens).toHaveLength(6);
      expect(compiler.line).toEqual(1);
    });

    it("move to statement state", () => {
      compiler.tokens = ["LABEL", "ADD", "56"];

      parse(compiler);

      expect(compiler.errors).toHaveLength(0);
      expect(compiler.state).toEqual(AssemblyParserState.STATEMENT);
      expect(compiler.tokens).toHaveLength(3);
      expect(compiler.line).toEqual(1);
    });
  });

  describe("EOL", () => {
    beforeEach(() => {
      compiler.tokens = [];
      compiler.line = 1;
      compiler.state = AssemblyParserState.EOL;
      compiler.errors = [];
    });

    it("parse EOL token", () => {
      compiler.tokens = [TOKEN_EOL, "NEXT"];

      parse(compiler);

      expect(compiler.errors).toHaveLength(0);
      expect(compiler.state).toEqual(AssemblyParserState.PROGRAM);
      expect(compiler.tokens).toEqual(expect.arrayContaining(["NEXT"]));
      expect(compiler.line).toEqual(2);
    });

    it("parse bad token", () => {
      compiler.tokens = ["BAD", "NEXT"];

      parse(compiler);

      expect(compiler.errors).toHaveLength(1);
      expect(compiler.state).toEqual(AssemblyParserState.ERROR_SYNTAX);
      expect(compiler.tokens).toEqual(expect.arrayContaining(["BAD", "NEXT"]));
      expect(compiler.line).toEqual(1);
    });
  });

  describe("Comment", () => {
    beforeEach(() => {
      compiler.tokens = [];
      compiler.line = 1;
      compiler.state = AssemblyParserState.COMMENT;
      compiler.errors = [];
    });

    it("parse tokens until EOL", () => {
      compiler.tokens = [TOKEN_COMMENT, "here", "are", "some", "tokens", TOKEN_EOL];

      parse(compiler);
      parse(compiler);
      parse(compiler);
      parse(compiler);
      parse(compiler);
      parse(compiler);

      expect(compiler.errors).toHaveLength(0);
      expect(compiler.state).toEqual(AssemblyParserState.EOL);
      expect(compiler.tokens).toEqual(expect.arrayContaining([TOKEN_EOL]));
      expect(compiler.line).toEqual(1);
    });
  });

  describe("Statement", () => {
    beforeEach(() => {
      compiler.tokens = [];
      compiler.line = 1;
      compiler.state = AssemblyParserState.STATEMENT;
      compiler.errors = [];
      compiler.currentStatement = {
        line: 1,
        label: "LABEL",
        instruction: null,
        argument: null
      };
    });

    it("parse label", () => {
      compiler.tokens = ["LABEL", "ADD", "123", TOKEN_EOL];

      parse(compiler);

      expect(compiler.errors).toHaveLength(0);
      expect(compiler.state).toEqual(AssemblyParserState.INSTRUCTION);
      expect(compiler.tokens).toEqual(expect.arrayContaining(["ADD", "123", TOKEN_EOL]));
      expect(compiler.currentStatement).not.toBeNull();
      expect(compiler.currentStatement.label).toEqual("LABEL");
      expect(compiler.line).toEqual(1);
    });

    it("parse no label", () => {
      compiler.tokens = ["ADD", "123", TOKEN_EOL];

      parse(compiler);

      expect(compiler.errors).toHaveLength(0);
      expect(compiler.state).toEqual(AssemblyParserState.INSTRUCTION);
      expect(compiler.tokens).toEqual(expect.arrayContaining(["ADD", "123", TOKEN_EOL]));
      expect(compiler.currentStatement).not.toBeNull();
      expect(compiler.currentStatement.label).toBeNull();
      expect(compiler.line).toEqual(1);
    });

    it("bad label", () => {
      compiler.tokens = ["123", "ADD", "123", TOKEN_EOL];

      parse(compiler);

      expect(compiler.errors).toHaveLength(1);
      expect(compiler.state).toEqual(AssemblyParserState.ERROR_SYNTAX);
      expect(compiler.tokens).toEqual(expect.arrayContaining(["123", "ADD", "123", TOKEN_EOL]));
      expect(compiler.currentStatement).toBeNull();
      expect(compiler.line).toEqual(1);
    });
  });

  describe("Instruction", () => {
    beforeEach(() => {
      compiler.tokens = [];
      compiler.line = 1;
      compiler.state = AssemblyParserState.INSTRUCTION;
      compiler.currentStatement = {
        line: 1,
        label: "LABEL",
        instruction: null,
        argument: null
      };
      compiler.errors = [];
    });

    it("parse instruction", () => {
      compiler.tokens = ["ADD", "123", TOKEN_EOL];

      parse(compiler);

      expect(compiler.errors).toHaveLength(0);
      expect(compiler.state).toEqual(AssemblyParserState.ARGUMENT);
      expect(compiler.tokens).toEqual(expect.arrayContaining(["123", TOKEN_EOL]));
      expect(compiler.currentStatement.instruction).toEqual("ADD");
      expect(compiler.line).toEqual(1);
    });

    it("bad instruction", () => {
      compiler.tokens = ["BAD", "123", TOKEN_EOL];

      parse(compiler);

      expect(compiler.errors).toHaveLength(1);
      expect(compiler.state).toEqual(AssemblyParserState.ERROR_SYNTAX);
      expect(compiler.tokens).toEqual(expect.arrayContaining(["BAD", "123", TOKEN_EOL]));
      expect(compiler.currentStatement).toBeNull();
      expect(compiler.line).toEqual(1);
    });
  });

  describe("Argument", () => {
    beforeEach(() => {
      compiler.tokens = [];
      compiler.line = 1;
      compiler.state = AssemblyParserState.ARGUMENT;
      compiler.errors = [];
      compiler.currentStatement = {
        line: 1,
        label: "LABEL",
        instruction: Mnemonic.ADD,
        argument: null
      };
    });

    it("parse label argument", () => {
      compiler.tokens = ["LABEL", TOKEN_EOL];

      parse(compiler);

      expect(compiler.errors).toHaveLength(0);
      expect(compiler.state).toEqual(AssemblyParserState.EOL);
      expect(compiler.tokens).toEqual(expect.arrayContaining([TOKEN_EOL]));
      expect(compiler.currentStatement.argument).toEqual("LABEL");
      expect(compiler.line).toEqual(1);
    });

    it("parse number argument", () => {
      compiler.tokens = ["123", TOKEN_EOL];

      parse(compiler);

      expect(compiler.errors).toHaveLength(0);
      expect(compiler.state).toEqual(AssemblyParserState.EOL);
      expect(compiler.tokens).toEqual(expect.arrayContaining([TOKEN_EOL]));
      expect(compiler.currentStatement.argument).toEqual("123");
      expect(compiler.line).toEqual(1);
    });

    it("parse no argument", () => {
      compiler.tokens = [TOKEN_EOL];

      parse(compiler);

      expect(compiler.errors).toHaveLength(0);
      expect(compiler.state).toEqual(AssemblyParserState.EOL);
      expect(compiler.tokens).toEqual(expect.arrayContaining([TOKEN_EOL]));
      expect(compiler.currentStatement.argument).toBeNull();
      expect(compiler.line).toEqual(1);
    });

    it("bad argument", () => {
      compiler.tokens = ["ADD"];

      parse(compiler);

      expect(compiler.errors).toHaveLength(1);
      expect(compiler.state).toEqual(AssemblyParserState.ERROR_SYNTAX);
      expect(compiler.tokens).toEqual(expect.arrayContaining(["ADD"]));
      expect(compiler.currentStatement).toBeNull();
      expect(compiler.line).toEqual(1);
    });
  });
});

describe("compile source", () => {
  it("valid source: count to zero", () => {
    const source =
      "INP\n\
      OUT      // Initialize output\n\
 LOOP BRZ QUIT // If the accumulator value is 0, jump to the memory address labeled QUIT\n\
      SUB ONE  // Label this memory address as LOOP, The instruction will then subtract the value stored at address ONE from the accumulator\n\
      OUT\n\
      BRA LOOP // Jump (unconditionally) to the memory address labeled LOOP\n\
 QUIT HLT      // Label this memory address as QUIT\n\
 ONE  DAT 1    // Store the value 1 in this memory address, and label it ONE (variable declaration)\n\
      ";

    const output = compileAssembly(source);

    const expectedProgram = [902, 901, 706, 207, 901, 602, 0, 1];
    expect(output.errors).toHaveLength(0);
    expect(output.program).toEqual(expect.arrayContaining(expectedProgram));
  });

  it("valid source: square and output", () => {
    const source =
      "START   LDA ZERO     // Initialize for multiple program run\n\
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
ZERO  DAT 0        // Constant, value of 0 (defaults to 0)\n";

    const output = compileAssembly(source);

    const expectedProgram = [523, 419, 420, 902, 718, 422, 519, 122, 419, 520, 121, 420, 222, 715, 606, 519, 901, 600, 0, 0, 1, 0, 0];

    expect(output.errors).toHaveLength(0);
    expect(output.program).toEqual(expect.arrayContaining(expectedProgram));
  });
});
