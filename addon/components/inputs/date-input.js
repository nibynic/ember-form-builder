import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import StringInput from './string-input';

@classic
export default class DateInput extends StringInput {
  type = 'date';

  @computed('config.value')
  get value() {
    var date = this.get('config.value');
    return formatDate(date);
  }

  set value(value) {
    if (value.length === 0) {
      this.set('config.value', undefined);
    } else {
      var timestamp = Date.parse(value + 'T00:00Z');
      if (isNaN(timestamp)) {
        return value;
      } else {
        var date = new Date(timestamp);
        this.set('config.value', date);
        return formatDate(date);
      }
    }
    return undefined;
  }
}

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
