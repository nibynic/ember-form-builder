import Ember from "ember";
import FormBuilder from "ember-cli-simple-form/models/form-builder";

export default Ember.Component.extend({
  tagName: "form",
  
  formBuilder: function() {
    return FormBuilder.create({
      object: this.get("for"),
      name: this.get("as")
    });
  }.property()
});
