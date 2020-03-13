import classic from 'ember-classic-decorator';
import { attributeBindings, tagName, layout as templateLayout } from '@ember-decorators/component';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import Component from '@ember/component';
import layout from '../../templates/components/inputs/select-option';
import { isArray } from '@ember/array';

@classic
@templateLayout(layout)
@tagName('option')
@attributeBindings('value', 'isSelected:selected')
export default class SelectOption extends Component {
  @reads('content.label')
  label;

  @reads('content.value')
  value;

  @computed('selectedValue.[]', 'content.content')
  set isSelected(v) {
    return this.get('isSelected');
  }

  get isSelected() {
    let selectedValue = this.get('selectedValue');
    let content = this.get('content.content');
    if (isArray(selectedValue)) {
      return selectedValue.includes(content);
    } else {
      return selectedValue === content;
    }
  }
}
