import Component from '@glimmer/component';
import { computed } from '@ember/object';
import { isArray } from '@ember/array';

export default class SelectOption extends Component {

  @computed('args.{selectedValue.[],content.content}')
  get isSelected() {
    if (isArray(this.args.selectedValue)) {
      return this.args.selectedValue.includes(this.args.content.content);
    } else {
      return this.args.selectedValue === this.args.content.content;
    }
  }

}
