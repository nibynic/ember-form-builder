import classic from 'ember-classic-decorator';
import { tagName, layout as templateLayout } from '@ember-decorators/component';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import SelectOption from 'ember-form-builder/components/inputs/select-option';
import layout from '../../templates/components/inputs/checkbox-option';

@classic
@templateLayout(layout)
@tagName('div')
export default class CheckboxOption extends SelectOption {
  @alias('isSelected')
  isChecked;

  @computed
  get inputElementId() {
    return this.get('elementId') + '-input';
  }
}
