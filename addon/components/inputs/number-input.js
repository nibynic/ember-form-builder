import StringInput from './string-input';
import { action, get, set, computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { isPresent } from '@ember/utils';
import classic from 'ember-classic-decorator';

@classic
export default class NumberInput extends StringInput {
  type = 'number';

  @computed('args.config.value')
  get value() {
    return this.args.config.value;
  }

  @action
  handleChange(e) {
    let value = e.target.value;
    value = parseFloat(value);
    value = isNaN(value) ? undefined : value;
    set(this, 'args.config.value', value);
  }

  @reads('args.config.validations.number')
  validations;

  @computed('validations.integer')
  get step() {
    return get(this, 'validations.integer') ? 1 : 0.01;
  }

  @computed('validations.{gt,gte}', 'step')
  get min() {
    var n = get(this, 'validations.gt');
    if (isPresent(n)) {
      return n * 1 + this.step;
    } else {
      return get(this, 'validations.gte');
    }
  }

  @computed('validations.{lt,lte}', 'step')
  get max() {
    var n = get(this, 'validations.lt');
    if (isPresent(n)) {
      return n * 1 - this.step;
    } else {
      return get(this, 'validations.lte');
    }
  }
}
