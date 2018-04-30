import { computed } from '@ember/object';
import TextField from '@ember/component/text-field';
import InputDefaultsMixin from "ember-form-builder/mixins/input-defaults";

function pad(number) {
  if (number < 10) {
    return "0" + number;
  }
  return number;
}

function formatDate(date) {
  if (date && date.getFullYear && date.getMonth && date.getDate) {
    return date.getFullYear() +
        "-" + pad(date.getMonth() + 1) +
        "-" + pad(date.getDate());
  } else {
    return null;
  }
}

export default TextField.extend(InputDefaultsMixin, {
  type: "date",

  value: computed("modelValue", {
    get() {
      var date = this.get("modelValue");
      return formatDate(date);
    },
    set(key, value) {
      var timestamp = Date.parse(value);
      if (isNaN(timestamp)) {
        this.set("modelValue", null);
        return null;
      } else {
        var date = new Date(timestamp);
        this.set("modelValue", date);
        return formatDate(date);
      }
    }
  })
});
