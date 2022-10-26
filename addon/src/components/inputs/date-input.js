import StringInput from './string-input';
import { action } from '@ember/object';

export default class DateInput extends StringInput {
  type = 'date';

  get value() {
    return formatDate(this.args.config.value);
  }

  @action
  handleChange(e) {
    let value = e.target.value;
    if (value.length === 0) {
      this.args.config.value = undefined;
    } else {
      let timestamp = Date.parse(value + 'T00:00Z');
      if (isNaN(timestamp)) {
        return value;
      } else {
        var date = new Date(timestamp);
        this.args.config.value = date;
      }
    }
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
    return (
      pad(date.getFullYear(), 4) +
      '-' +
      pad(date.getMonth() + 1) +
      '-' +
      pad(date.getDate())
    );
  } else {
    return null;
  }
}
