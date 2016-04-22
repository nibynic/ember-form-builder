import Ember from "ember";
import InputDefaultsMixin from "ember-form-builder/mixins/input-defaults";

export default Ember.TextField.extend(InputDefaultsMixin, {
  type: "password"
});
