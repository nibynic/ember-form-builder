import Ember from "ember";

export default Ember.TextField.extend({
  value: Ember.computed.alias("modelValue"),
  type: "email"
});
