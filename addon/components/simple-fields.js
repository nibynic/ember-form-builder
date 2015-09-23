import Ember from "ember";
import SimpleForm from "ember-simple-form/components/simple-form";

export default SimpleForm.extend({
  tagName: "div",

  parentFormBuilder: Ember.computed.alias("on"),

  didInsertElement() {
    this.get("parentFormBuilder").addChild(this.get("formBuilder"));
  },

  willDestroy() {
    this.get("parentFormBuilder").removeChild(this.get("formBuilder"));
  }
});
