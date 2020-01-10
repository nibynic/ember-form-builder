import { triggerEvent } from '@ember/test-helpers';

export default {
  read(input) {
    return input.querySelector('input').checked;
  },

  async write(input, value) {
    let field = input.querySelector('input');
    field.checked = value;
    await triggerEvent(field, 'change');
  }
};
