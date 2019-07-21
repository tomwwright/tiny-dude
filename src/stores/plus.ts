import { observable, computed, action } from "mobx";

import { TinyDudePlusCompiler } from "../models/tinydudepluscompiler";

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
}
