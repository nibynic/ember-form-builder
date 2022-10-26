import StringInput from './string-input';
import { action } from '@ember/object';
import { isPresent } from '@ember/utils';

export default class NumberInputComponent extends StringInput {
  type = 'number';

  get value() {
    return this.args.config.value;
  }

  @action
  handleChange(e) {
    let value = e.target.value;
    value = parseFloat(value);
    value = isNaN(value) ? undefined : value;
    this.args.config.value = value;
  }

  get validations() {
    return this.args.config.validations?.number;
  }

  get step() {
    return this.validations?.integer ? 1 : 0.01;
  }

  get min() {
    var n = this.validations?.gt;
    if (isPresent(n)) {
      return n * 1 + this.step;
    } else {
      return this.validations?.gte;
    }
  }

  get max() {
    var n = this.validations?.lt;
    if (isPresent(n)) {
      return n * 1 - this.step;
    } else {
      return this.validations?.lte;
    }
  }
}
