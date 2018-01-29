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
    this.isCodeHelpOpen = true;
  }

  @action
  closeControlsHelp() {
    this.isCodeHelpOpen = false;
  }
}
