import { fillIn } from '@ember/test-helpers';

export default {
  read(input) {
    return input.querySelector('textarea').value;
  },

  async write(input, value) {
    await fillIn(input.querySelector('textarea'), value);
  }
};
