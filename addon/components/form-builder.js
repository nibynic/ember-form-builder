import { oneWay } from '@ember/object/computed';
import { isPresent } from '@ember/utils';
import { computed } from '@ember/object';
import Component from '@ember/component';
import FormBuilder from "ember-form-builder/models/form-builder";

export default Component.extend({
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

  formBuilder: computed("for", "as", "translationKey", function() {
    var params = {
      object: this.get("for")
    };
    if (isPresent(this.get('as'))) {
      params.modelName = this.get('as');
    }
    if (isPresent(this.get("translationKey"))) {
      params.translationKey = this.get("translationKey");
    }
    if (isPresent(this.get("model"))) {
      params.model = this.get("model");
    }
    return FormBuilder.create(params);
  }),

  isValid: oneWay("formBuilder.isValid")
});
