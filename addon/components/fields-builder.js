import Ember from "ember";
import FormBuilder from "ember-form-builder/components/form-builder";

export default FormBuilder.extend({
  tagName: "div",

  parentFormBuilder: Ember.computed.alias("on"),

  didInsertElement() {
    this.get("parentFormBuilder").addChild(this.get("formBuilder"));
  },

  willDestroy() {
    this.get("parentFormBuilder").removeChild(this.get("formBuilder"));
  }
});
