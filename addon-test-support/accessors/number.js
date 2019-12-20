export default {
  read(input) {
    let value = input.querySelector('input').value;
    return value ? value * 1 : value;
  },

  write(input, value) {
    input.querySelector('input').value = value;
  }
};
