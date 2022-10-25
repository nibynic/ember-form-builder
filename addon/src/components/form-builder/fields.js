import FormBuilder from '../form-builder';
import { action } from '@ember/object';

export default class Fields extends FormBuilder {
  @action
  initializeBuilder() {
    this.args.on.addChild(this.formBuilder);
  }

  @action
  destroyBuilder() {
    this.args.on.removeChild(this.formBuilder);
  }
}
