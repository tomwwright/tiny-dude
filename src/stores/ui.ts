import { observable, computed, action } from 'mobx';

export default class UiStore {
  @observable isCodeHelpOpen: boolean = false;

  @action
  openCodeHelp() {
    this.isCodeHelpOpen = true;
  }

  @action
  closeCodeHelp() {
    this.isCodeHelpOpen = false;
  }
}
