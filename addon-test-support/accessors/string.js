export default {
  read(input) {
    return input.querySelector('input').value;
  },

  write(input, value) {
    input.querySelector('input').value = value;
  }
};
