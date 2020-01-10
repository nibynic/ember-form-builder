import { fillIn } from '@ember/test-helpers';

export default {
  read(input) {
    let value = input.querySelector('input').value;
    return value ? new Date(value) : value;
  },

  async write(input, value) {
    await fillIn(input.querySelector('input'), value ? value.toISOString().substring(0,10) : value);
  }
};
