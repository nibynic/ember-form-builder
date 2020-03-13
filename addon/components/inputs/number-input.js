import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import StringInput from './string-input';
import { isPresent } from '@ember/utils';

@classic
export default class NumberInput extends StringInput {
  type = 'number';

  @computed('config.value')
  get value() {
    return this.get('config.value');
  }

  set value(v) {
    v = parseFloat(v);
    v = isNaN(v) ? undefined : v;
    this.set('config.value', v);
    return v;
  }

  @reads('config.validations.number')
  validations;

  @computed('validations.integer')
  get step() {
    return this.get('validations.integer') ? 1 : 0.01;
  }

  @computed('validations.{gt,gte}', 'step')
  get min() {
    var n = this.get('validations.gt');
    if (isPresent(n)) {
      return n * 1 + this.get('step');
    } else {
      return this.get('validations.gte');
    }
  }

  @computed('validations.{lt,lte}', 'step')
  get max() {
    var n = this.get('validations.lt');
    if (isPresent(n)) {
      return n * 1 - this.get('step');
    } else {
      return this.get('validations.lte');
    }
  }
}
