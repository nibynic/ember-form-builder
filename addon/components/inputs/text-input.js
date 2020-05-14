import Component from '@glimmer/component';
import { action, set } from '@ember/object';

export default class extends Component {
  @action
  handleChange(e) {
    set(this, 'args.config.value', e.target.value);
  }

}
