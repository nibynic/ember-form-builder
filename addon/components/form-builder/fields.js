import { computed } from '@ember/object';
import FormBuilder from "ember-form-builder/components/form-builder";

export default FormBuilder.extend({
  tagName: "div",
  parentFormBuilder: null,

  on: computed({
    set(key, value) {
      if (value && value.builder) {
        this.set("parentFormBuilder", value.builder);
      } else {
        this.set("parentFormBuilder", value);
      }

      return this.get("parentFormBuilder");
    }
  }),

  init() {
    this._super(...arguments);
    this.get("parentFormBuilder").addChild(this.get("formBuilder"));
  },

  destroy() {
    this._super(...arguments);
    this.get("parentFormBuilder").removeChild(this.get("formBuilder"));
  }
});
