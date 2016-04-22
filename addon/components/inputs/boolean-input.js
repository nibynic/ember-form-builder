import Ember from "ember";
import InputDefaultsMixin from "ember-form-builder/mixins/input-defaults";

export default Ember.Checkbox.extend(InputDefaultsMixin, {
  checked: Ember.computed.alias("value")
});
