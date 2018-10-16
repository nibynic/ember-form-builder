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

  formBuilder: computed("for", "as", "translationKey", 'index', function() {
    let params = {};
    let mapping = {
      for: 'object',
      as: 'modelName',
      translationKey: 'translationKey',
      model: 'model',
      index: 'index'
    };
    Object.entries(mapping).forEach(([from, to]) => {
      let value = this.get(from);
      if (isPresent(value)) {
        params[to] = value;
      }
    });
    return FormBuilder.create(params);
  }),

  isValid: oneWay("formBuilder.isValid")
});
