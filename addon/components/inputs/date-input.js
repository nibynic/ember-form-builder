import Ember from "ember";
import InputDefaultsMixin from "ember-simple-form/mixins/input-defaults";

function formatDate(date) {
  if (date && date.toISOString) {
    return date.toISOString().substring(0, 10);
  } else {
    return null;
  }
}

export default Ember.TextField.extend(InputDefaultsMixin, {
  type: "date",

  value: Ember.computed("modelValue", {
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
