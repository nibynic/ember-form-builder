import Ember from "ember";

export default Ember.Checkbox.extend({
  checked: Ember.computed.alias("value")
});
