import Component from '@glimmer/component';
import { action, set, computed } from '@ember/object';

export default class extends Component {
  type = 'text';

  @computed('args.config.value')
  get value() {
    return this.args.config.value;
  }

  @action
  handleChange(e) {
    set(this, 'args.config.value', e.target.value);
  }

}
