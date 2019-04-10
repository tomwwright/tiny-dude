import { observable, computed, action } from "mobx";

import ComputeStore from "./compute";

export default class RunStore {
  @observable isRunning: boolean = false;

  computeStore: ComputeStore;

  runInterval: NodeJS.Timer = null;

  constructor(computeStore: ComputeStore) {
    this.computeStore = computeStore;
  }

  @action
  run(tickMs: number) {
    if (!this.computeStore.isRunning || this.isRunning) return;

    this.isRunning = true;

    this.runInterval = setInterval(() => {
      if (this.computeStore.isRunning) {
        this.computeStore.cycle();
      }

      if (!this.computeStore.isRunning) {
        this.stop();
      }
    }, tickMs);
  }

  @action
  stop() {
    if (this.isRunning) {
      this.isRunning = false;
      clearInterval(this.runInterval);
    }
  }
}
