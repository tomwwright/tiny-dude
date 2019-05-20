import { observable, computed, action } from "mobx";

import { TinyDudePlusCompiler } from "../models/tinydudepluscompiler";

export default class TinyDudePlusStore {
  @observable source: string = "";

  @computed get compilation() {
    return TinyDudePlusCompiler.compile(this.source);
  }

  @action
  compile(source: string): void {
    this.source = source;
  }
}
