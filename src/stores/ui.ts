import { observable, computed, action } from 'mobx';

export default class UiStore {
  @observable isCodeHelpOpen: boolean = false;
  @observable isControlsHelpOpen: boolean = false;

  @action
  openCodeHelp() {
    this.isCodeHelpOpen = true;
  }

  @action
  closeCodeHelp() {
    this.isCodeHelpOpen = false;
  }

  @action
  openControlsHelp() {
    this.isControlsHelpOpen = true;
  }

  @action
  closeControlsHelp() {
    this.isControlsHelpOpen = false;
  }
}
