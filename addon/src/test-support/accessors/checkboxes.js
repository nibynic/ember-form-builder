import { triggerEvent } from '@ember/test-helpers';
import { isArray } from '@ember/array';

export default {
  read(input) {
    let values = Array.prototype.slice
      .apply(input.querySelectorAll('input:checked'))
      .map((i) => i.value);
    if (input.querySelector('input').type === 'checkbox') {
      return values;
    } else {
      return values[0];
    }
  },

  async write(input, value) {
    value = isArray(value) ? value : [value];
    for (let field of input.querySelectorAll('input')) {
      field.checked = value.includes(field.value);
      await triggerEvent(field, 'change');
    }
  },
};
