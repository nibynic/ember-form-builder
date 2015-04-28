import Ember from "ember";
import FormBuilder from "ember-simple-form/models/form-builder";

export default Ember.Component.extend({
  tagName: "form",

  submit: function(event) {
    event.preventDefault();
    var self = this;

    if (!this.get("formBuilder.object.validate")) {
      this.sendAction();
    } else {
      this.get("formBuilder.object").validate().then(function() {
        self.set("formBuilder.isValid", true);
        self.sendAction();
      }, function() {
        self.set("formBuilder.isValid", false);
        self.sendAction("submitFailed");
      });
    }
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
  })
});
