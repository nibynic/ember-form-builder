import Ember from "ember";
import InputDefaultsMixin from "ember-simple-form/mixins/input-defaults";

export default Ember.TextField.extend(InputDefaultsMixin, {
  type: "number",

  step: Ember.computed("validations.numericality.onlyInteger", {
    get() {
      return this.get("validations.numericality.onlyInteger") ? 1 : 0.01;
    }
  }),

  min: Ember.computed("validations.numericality.greaterThan", "validations.numericality.greaterThanOrEqualTo", "step", {
    get() {
      var n = this.get("validations.numericality.greaterThan");
      if (Ember.isPresent(n)) {
        return n * 1 + this.get("step");
      } else {
        return this.get("validations.numericality.greaterThanOrEqualTo");
      }
    }
  }),

  max: Ember.computed("validations.numericality.lessThan", "validations.numericality.lessThanOrEqualTo", "step", {
    get() {
      var n = this.get("validations.numericality.lessThan");
      if (Ember.isPresent(n)) {
        return n * 1 - this.get("step");
      } else {
        return this.get("validations.numericality.lessThanOrEqualTo");
      }
    }
  }),
});
