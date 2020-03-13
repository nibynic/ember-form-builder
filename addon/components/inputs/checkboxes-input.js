import classic from 'ember-classic-decorator';
import { tagName, layout as templateLayout } from '@ember-decorators/component';
import { computed } from '@ember/object';
import CollectionInput from 'ember-form-builder/components/inputs/collection-input';
import layout from '../../templates/components/inputs/checkboxes-input';

@classic
@templateLayout(layout)
@tagName('div')
export default class CheckboxesInput extends CollectionInput {
  optionComponentName = 'inputs/checkbox-option';

  change() {
    var indices = [];
    this.element.querySelectorAll('input').forEach(function(input, i) {
      if(input.checked) {
        indices.push(i);
      }
    });
    this._setSelection(indices);
  }

  @computed('multiple')
  get inputType() {
    return this.get('multiple') ? 'checkbox' : 'radio';
  }

  @computed('required', 'multiple')
  get normalizedRequired() {
    return !this.get('multiple') && this.get('required');
  }
}
