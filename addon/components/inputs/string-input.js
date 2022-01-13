import Component from '@glimmer/component';
import { action, set } from '@ember/object';
import { reads } from '@ember/object/computed';
import classic from 'ember-classic-decorator';

@classic
export default class extends Component {
  type = 'text';

  @reads('args.config.value') value;

  @action
  handleChange(e) {
    set(this, 'args.config.value', e.target.value);
  }
}
