import { observable, computed, action } from 'mobx';

import { compileAssembly, CompilerError } from 'models/assemblycompiler';

export default class AssemblyStore {
  @observable source: string = '';
  @observable program: number[] = [];
  @observable compileErrors: CompilerError[];

  @action
  compile(source: string): boolean {
    this.source = source;
    this.program = [];
    this.compileErrors = [];

    const compilerOut = compileAssembly(source);

    if (compilerOut.errors.length > 0) {
      this.compileErrors = compilerOut.errors;
      return false;
    } else {
      this.program = compilerOut.program;
      return true;
    }
  }
}
