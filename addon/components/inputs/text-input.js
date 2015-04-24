import Ember from "ember";

export default Ember.TextArea.extend({
  value: Ember.computed.alias("modelValue")
});
