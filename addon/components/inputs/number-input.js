import { isPresent } from '@ember/utils';
import { computed } from '@ember/object';
import TextField from '@ember/component/text-field';
import InputDefaultsMixin from "ember-form-builder/mixins/input-defaults";

export default TextField.extend(InputDefaultsMixin, {
  type: "number",

  value: computed('modelValue', {
    get() {
      return this.get('modelValue');
    },
    set(k, v) {
      v = parseFloat(v);
      v = isNaN(v) ? undefined : v;
      this.set('modelValue', v);
      return v;
    }
  }),

  step: computed("validations.numericality.onlyInteger", {
    get() {
      return this.get("validations.numericality.onlyInteger") ? 1 : 0.01;
    }
  }),

  min: computed("validations.numericality.{greaterThan,greaterThanOrEqualTo}", "step", {
    get() {
      var n = this.get("validations.numericality.greaterThan");
      if (isPresent(n)) {
        return n * 1 + this.get("step");
      } else {
        return this.get("validations.numericality.greaterThanOrEqualTo");
      }
    }
  }),

  max: computed("validations.numericality.{lessThan,lessThanOrEqualTo}", "step", {
    get() {
      var n = this.get("validations.numericality.lessThan");
      if (isPresent(n)) {
        return n * 1 - this.get("step");
      } else {
        return this.get("validations.numericality.lessThanOrEqualTo");
      }
    }
  }),
});
