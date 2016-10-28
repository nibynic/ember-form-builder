import Ember from "ember";
import FormBuilder from "ember-form-builder/components/form-builder";

export default FormBuilder.extend({
  tagName: "div",
  parentFormBuilder: null,

  on: Ember.computed({
    set(key, value) {
      if (value && value.builder) {
        this.set("parentFormBuilder", value.builder);
      } else {
        this.set("parentFormBuilder", value);
      }

      return this.get("parentFormBuilder");
    }
  }),

  didInsertElement() {
    this.get("parentFormBuilder").addChild(this.get("formBuilder"));
  },

  willDestroy() {
    this.get("parentFormBuilder").removeChild(this.get("formBuilder"));
  }
});
