import Ember from "ember";

export default Ember.Checkbox.extend({
  value: Ember.computed.alias("modelValue"),
  checked: Ember.computed.alias("value")
});
