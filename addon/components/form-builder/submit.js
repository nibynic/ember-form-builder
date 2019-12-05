import Component from '@ember/component';
import layout from '../../templates/components/form-builder/submit';
import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import byDefault from 'ember-form-builder/utilities/by-default';

const SimpleSubmit = Component.extend({
  layout,

  translationService: service("formBuilderTranslations"),
  tagName: "button",
  type: "submit",
  attributeBindings: ["type", "isDisabled:disabled"],

  isDisabled: oneWay("builder.isLoading"),
  builder: computed({
    get() {
      return this._builder;
    },
    set(key, value) {
      if (value && value.builder) {
        return this._builder = value.builder;
      } else {
        return this._builder = value;
      }
    }
  }),

  text: byDefault('builder.translationKey', 'translationService.locale', function() {
    return this.get('translationService').t(this.get('builder.translationKey'), 'action', 'submit') || 'Save';
  })
});

SimpleSubmit.reopenClass({
  positionalParams: ["builder"]
});

export default SimpleSubmit;
