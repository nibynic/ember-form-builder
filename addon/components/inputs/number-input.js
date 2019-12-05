import StringInput from './string-input';
import { isPresent } from '@ember/utils';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';

export default StringInput.extend({
  type: 'number',

  value: computed('config.value', {
    get() {
      return this.get('config.value');
    },
    set(k, v) {
      v = parseFloat(v);
      v = isNaN(v) ? undefined : v;
      this.set('config.value', v);
      return v;
    }
  }),

  validations: reads('config.validations.number'),

  step: computed('validations.integer', {
    get() {
      return this.get('validations.integer') ? 1 : 0.01;
    }
  }),

  min: computed('validations.{gt,gte}', 'step', {
    get() {
      var n = this.get('validations.gt');
      if (isPresent(n)) {
        return n * 1 + this.get('step');
      } else {
        return this.get('validations.gte');
      }
    }
  }),

  max: computed('validations.{lt,lte}', 'step', {
    get() {
      var n = this.get('validations.lt');
      if (isPresent(n)) {
        return n * 1 - this.get('step');
      } else {
        return this.get('validations.lte');
      }
    }
  })
});
