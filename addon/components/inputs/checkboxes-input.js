import { computed, action, get } from '@ember/object';
import CollectionInput from 'ember-form-builder/components/inputs/collection-input';

export default class CheckboxesInput extends CollectionInput {
  optionComponentName = 'inputs/checkbox-option';

  @action
  registerWrapper(el) {
    this.wrapper = el;
  }

  @action
  handleChange() {
    var indices = [];
    this.wrapper.querySelectorAll('input').forEach(function(input, i) {
      if(input.checked) {
        indices.push(i);
      }
    });
    this._setSelection(indices);
  }

  @computed('multiple')
  get inputType() {
    return this.multiple ? 'checkbox' : 'radio';
  }

  @computed('args.config.validations.required', 'multiple')
  get normalizedRequired() {
    return !this.multiple && get(this, 'args.config.validations.required');
  }
}
