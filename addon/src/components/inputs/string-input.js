import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class StringInputComponent extends Component {
  type = 'text';

  get value() {
    return this.args.config.value;
  }

  @action
  handleChange(e) {
    this.args.config.value = e.target.value;
  }
}
