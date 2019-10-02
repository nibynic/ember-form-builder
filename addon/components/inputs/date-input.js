import { computed } from '@ember/object';
import TextField from '@ember/component/text-field';
import InputDefaultsMixin from 'ember-form-builder/mixins/input-defaults';

function pad(number, length = 2) {
  let result = number.toString();
  length = length - result.length;
  if (length > 0) {
    return Array(length + 1).join('0') + result;
  }
  return result;
}

function formatDate(date) {
  if (date && date.getFullYear && date.getMonth && date.getDate) {
    return pad(date.getFullYear(), 4) +
        '-' + pad(date.getMonth() + 1) +
        '-' + pad(date.getDate());
  } else {
    return null;
  }
}

export default TextField.extend(InputDefaultsMixin, {
  type: 'date',

  value: computed('modelValue', {
    get() {
      var date = this.get('modelValue');
      return formatDate(date);
    },
    set(key, value) {
      if (value.length === 0) {
        this.set('modelValue', undefined);
      } else {
        var timestamp = Date.parse(value + 'T00:00Z');
        if (isNaN(timestamp)) {
          return value;
        } else {
          var date = new Date(timestamp);
          this.set('modelValue', date);
          return formatDate(date);
        }
      }
    }
  })
});
