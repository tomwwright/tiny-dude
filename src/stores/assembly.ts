import { observable, computed, action } from "mobx";

import { compileAssembly, AssemblyCompiler } from "../models/assemblycompiler";

export default class AssemblyStore {
  @observable source: string = "";
  @observable compiled: AssemblyCompiler;

  @observable highlightedStatements: number[] = [];

  @action
  compile(source: string): boolean {
    this.source = source;

    this.compiled = compileAssembly(source);

    return this.compiled.errors.length > 0;
  }

  @action
  highlight(statementIndices: number[]) {
    this.highlightedStatements = statementIndices;
  }
}
