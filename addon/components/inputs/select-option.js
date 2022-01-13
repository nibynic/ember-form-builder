import Component from '@glimmer/component';
import { computed } from '@ember/object';
import { isArray, A } from '@ember/array';
import classic from 'ember-classic-decorator';

@classic
export default class SelectOption extends Component {
  @computed('args.{selectedValue.[],content.content,key}')
  get isSelected() {
    let key = this.args.key;
    if (isArray(this.args.selectedValue)) {
      return !!A(this.args.selectedValue)
        .map((obj) => unwrap(obj, key))
        .includes(unwrap(this.args.content.content, key));
    } else {
      return (
        unwrap(this.args.selectedValue, key) ===
        unwrap(this.args.content.content, key)
      );
    }
  }
}

function unwrap(obj, key) {
  if (key) {
    return (obj || {})[key];
  } else {
    return obj;
  }
}
