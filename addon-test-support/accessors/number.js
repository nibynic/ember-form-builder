import { fillIn } from '@ember/test-helpers';

export default {
  read(input) {
    let value = input.querySelector('input').value;
    return value ? value * 1 : value;
  },

  async write(input, value) {
    await fillIn(input.querySelector('input'), value);
  }
};
