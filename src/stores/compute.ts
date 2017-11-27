import { observable, computed, action } from 'mobx';

export default class ComputeStore {
  @observable accumulator: number = 0;
  @observable counter: number = 0;

  @observable memory: number[] = [];
  @observable memorySize: number = 100;

  @observable out: number = 0;

  @observable isRunning: boolean = false;

  constructor(memorySize: number) {
    this.memorySize = memorySize;
    for (let i = 0; i < memorySize; ++i) {
      this.memory.push(0);
    }
  }

  private reset() {
    this.accumulator = 0;
    this.counter = 0;
    this.memory = [];
    for (let i = 0; i < this.memorySize; ++i) {
      this.memory.push(0);
    }
  }

  @action
  init(data: number[]) {
    this.reset();
    for (let i = 0; i < data.length; ++i) {
      this.memory[i] = data[i];
    }
    this.isRunning = true;
  }

  @action
  cycle() {
    if (!this.isRunning) {
      return;
    }

    const mem = this.memory[this.counter];

    const goto = this.opcode(mem);

    this.counter = goto != null ? goto : this.counter + 1;
  }

  private opcode(input: number): number {
    const opcode = Math.floor(input / 100);
    const value = input % 100;

    let goto = null;

    switch (opcode) {
      case 0:
        this.halt();
        break;
      case 1:
        this.add(value);
        break;
      case 2:
        this.subtract(value);
        break;
      case 4:
        this.store(value);
        break;
      case 5:
        this.load(value);
        break;
      case 6:
        goto = this.jump(value);
        break;
      case 7:
        goto = this.branchZero(value);
        break;
      case 8:
        goto = this.branchPositive(value);
        break;
      case 9:
        this.output();
        break;
    }

    return goto;
  }

  private halt() {
    this.isRunning = false;
  }

  private add(value: number) {
    this.accumulator = (this.accumulator + value) % 1000;
  }

  private subtract(value: number) {
    this.accumulator = (this.accumulator - value) % 1000;
  }

  private store(value: number) {
    this.memory[value] = this.accumulator;
  }

  private load(value: number) {
    this.accumulator = this.memory[value];
  }

  private jump(value: number) {
    return value;
  }

  private branchZero(value: number) {
    return this.accumulator === 0 ? value : null;
  }

  private branchPositive(value: number) {
    return this.accumulator > 0 ? value : null;
  }

  private output() {
    this.out = this.accumulator;
  }
}
