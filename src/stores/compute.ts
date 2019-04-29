import { observable, computed, action } from "mobx";

export default class ComputeStore {
  @observable accumulator: number = 0;
  @observable hasOverOrUnderflowed: null | "overflow" | "underflow" = null;
  @observable counter: number = 0;

  @observable memory: number[] = [];
  @observable memorySize: number = 100;

  @observable outputs: number[] = [];

  @observable isRunning: boolean = false;

  constructor(memorySize: number) {
    this.memorySize = memorySize;
    for (let i = 0; i < memorySize; ++i) {
      this.memory.push(0);
    }
  }

  private reset() {
    this.accumulator = 0;
    this.hasOverOrUnderflowed = null;
    this.counter = 0;
    this.memory = [];
    this.outputs = [];
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

  private opcode(input: number): number | null {
    const opcode = Math.floor(input / 100);
    const argument = input % 100;

    let goto = null;

    switch (opcode) {
      case 0:
        this.halt();
        goto = this.counter;
        break;
      case 1:
        this.add(argument);
        break;
      case 2:
        this.subtract(argument);
        break;
      case 4:
        this.store(argument);
        break;
      case 5:
        this.load(argument);
        break;
      case 6:
        goto = this.jump(argument);
        break;
      case 7:
        goto = this.branchZero(argument);
        break;
      case 8:
        goto = this.branchPositive(argument);
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

  private add(address: number) {
    const value = this.memory[address];
    this.accumulator = this.accumulator + value;
    if (this.accumulator > 999) {
      this.hasOverOrUnderflowed = "overflow";
      this.accumulator = this.accumulator % 1000;
    }
  }

  private subtract(address: number) {
    const value = this.memory[address];
    this.accumulator = this.accumulator - value;
    if (this.accumulator < 0) {
      this.hasOverOrUnderflowed = "underflow";
      this.accumulator = this.accumulator % 1000;
    }
  }

  private store(address: number) {
    this.memory[address] = this.accumulator;
  }

  private load(address: number) {
    this.accumulator = this.memory[address];
    this.hasOverOrUnderflowed = null;
  }

  private jump(value: number) {
    return value;
  }

  private branchZero(value: number) {
    return this.accumulator === 0 && !this.hasOverOrUnderflowed ? value : null;
  }

  private branchPositive(value: number) {
    return this.accumulator >= 0 && !this.hasOverOrUnderflowed ? value : null;
  }

  private output() {
    this.outputs.push(this.accumulator);
  }
}
