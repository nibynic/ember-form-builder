import Ember from "ember";
import FormBuilder from "ember-simple-form/models/form-builder";

export default Ember.Component.extend({
  tagName: "form",

  submit: function(event) {
    event.preventDefault();
    var self = this;

    this.get("formBuilder").validate().then(function() {
      self.sendAction();
    }, function() {
      self.sendAction("submitFailed");
    });
  },

  formBuilder: Ember.computed("for", "as", "translationKey", function() {
    var params = {
      object: this.get("for"),
      name: this.get("as")
    };
    if (Ember.isPresent(this.get("translationKey"))) {
      params.translationKey = this.get("translationKey");
    }
    if (Ember.isPresent(this.get("model"))) {
      params.model = this.get("model");
    }
    return FormBuilder.create(params);
  }),

  isValid: Ember.computed.oneWay("formBuilder.isValid")
});
