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

  step: computed("validations.number.integer", {
    get() {
      return this.get("validations.number.integer") ? 1 : 0.01;
    }
  }),

  min: computed("validations.number.{gt,gte}", "step", {
    get() {
      var n = this.get("validations.number.gt");
      if (isPresent(n)) {
        return n * 1 + this.get("step");
      } else {
        return this.get("validations.number.gte");
      }
    }
  }),

  max: computed("validations.number.{lt,lte}", "step", {
    get() {
      var n = this.get("validations.number.lt");
      if (isPresent(n)) {
        return n * 1 - this.get("step");
      } else {
        return this.get("validations.number.lte");
      }
    }
  }),
});
