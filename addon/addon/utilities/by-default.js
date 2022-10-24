import { computed } from '@ember/object';

export default function (...args) {
  let func = args.pop();
  return computed(...args, {
    get(key) {
      if (this[`_${key}IsSet`]) {
        return this[`_${key}`];
      } else {
        return func.call(this, key);
      }
    },
    set(key, value) {
      this[`_${key}IsSet`] = true;
      return (this[`_${key}`] = value);
    },
  });
}
