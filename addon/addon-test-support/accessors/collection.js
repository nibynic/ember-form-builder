import { triggerEvent } from '@ember/test-helpers';
import { isArray } from '@ember/array';

export default {
  read(input) {
    let values = Array.prototype.slice
      .apply(input.querySelectorAll('option:checked'))
      .map((i) => i.value);
    if (input.querySelector('select').multiple) {
      return values;
    } else {
      return values[0];
    }
  },

  async write(input, value) {
    value = isArray(value) ? value : [value];
    for (let option of input.querySelectorAll('option')) {
      option.selected = value.includes(option.value);
    }
    await triggerEvent(input.querySelector('select'), 'change');
  },
};
