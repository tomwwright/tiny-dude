import { observable, computed, action } from "mobx";

export default class UiStore {
  @observable isCodeHelpOpen: boolean = false;
  @observable isControlsHelpOpen: boolean = false;
  @observable isEditorInPlusMode: boolean = false;

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

  @action
  setEditorPlusMode(event: React.ChangeEvent<HTMLInputElement>) {
    this.isEditorInPlusMode = event.target.checked;
  }
}
