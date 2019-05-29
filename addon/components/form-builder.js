import { oneWay } from '@ember/object/computed';
import { isPresent } from '@ember/utils';
import { computed } from '@ember/object';
import Component from '@ember/component';
import FormBuilder from "ember-form-builder/models/form-builder";

export default Component.extend({
  tagName: "form",

  action() {},
  submitFailed() {},

  submit: function(event) {
    event.preventDefault();

    this.get("formBuilder").validate().then(
      () => this.action(),
      () => this.submitFailed()
    );
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
    if (this.get('as') === '') {
      params.modelName = this.get('as');
    }
    return FormBuilder.create(params);
  }),

  isValid: oneWay("formBuilder.isValid")
});
