import { fillIn } from '@ember/test-helpers';

export default {
  read(input) {
    return input.querySelector('input').value;
  },

  async write(input, value) {
    await fillIn(input.querySelector('input'), value);
  }
};
