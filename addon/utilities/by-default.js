import { computed } from '@ember/object';

export default function(...args) {
  let func = args.pop();
  return computed(...args, {
    get(key) {
      return this[`_${key}`] || func.call(this, key);
    },
    set(key, value) {
      return this[`_${key}`] = value;
    }
  })
}
