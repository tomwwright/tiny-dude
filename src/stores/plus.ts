import { observable, computed, action } from "mobx";

import { TinyDudePlusCompiler } from "../models/tinydudepluscompiler";
import { AST } from "../models/tinydudeplus/types";

export default class TinyDudePlusStore {
  @observable source: string = "";
  @observable sourceHighlighting: { start: number; end: number } = null;

  @computed get compilation() {
    return TinyDudePlusCompiler.compile(this.source);
  }

  @action
  compile(source: string): void {
    this.source = source;
  }

  @action
  setHighlightedSource(start: number, end: number) {
    this.sourceHighlighting = {
      start,
      end
    };
  }

  @action
  clearHighlightedSource() {
    this.sourceHighlighting = null;
  }

  @computed
  get compiledProgramStatementsLength() {
    if (!this.compilation.ast) return 0;

    const statementsInNode = (node: AST.Node) => {
      switch (node.node) {
        case "program":
        case "if":
        case "loop":
          return node.statements.reduce((sum, statement) => sum + statementsInNode(statement), 1);
      }
      return 1;
    };

    return statementsInNode(this.compilation.ast) - 1;
  }
}
