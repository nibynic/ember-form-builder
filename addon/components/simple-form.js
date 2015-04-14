import Ember from "ember";
import FormBuilder from "ember-simple-form/models/form-builder";

export default Ember.Component.extend({
  tagName: "form",

  submit: function(event) {
    event.preventDefault();
    this.sendAction();
  },

  formBuilder: Ember.computed("for", "as", "translationKey", function() {
    return FormBuilder.create({
      object: this.get("for"),
      name: this.get("as"),
      translationKey: this.get("translationKey")
    });
  })
});
