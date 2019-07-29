import { observable, computed, action } from "mobx";

import ComputeStore from "./compute";

export default class RunStore {
  @observable isRunning: boolean = false;
  @observable tickMs: number = 1000;

  private computeStore: ComputeStore;

  private runInterval: NodeJS.Timer = null;

  constructor(computeStore: ComputeStore) {
    this.computeStore = computeStore;
  }

  @computed
  get isRunningInFastMode() {
    return this.tickMs != 1000;
  }

  @action
  run() {
    if (!this.computeStore.isRunning || this.isRunning) return;

    this.isRunning = true;

    this.runInterval = setInterval(() => {
      if (this.computeStore.isRunning) {
        this.computeStore.cycle();
      }

      if (!this.computeStore.isRunning) {
        this.stop();
      }
    }, this.tickMs);
  }

  @action
  stop() {
    if (this.isRunning) {
      this.isRunning = false;
      clearInterval(this.runInterval);
    }
  }

  @action
  setTickMs(tickMs: number) {
    this.tickMs = tickMs;

    if (this.isRunning) {
      this.stop();
      this.run();
    }
  }
}
