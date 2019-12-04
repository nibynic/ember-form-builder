import Component from '@ember/component';
import layout from '../../templates/components/form-builder/input';
import { isEmpty, isPresent } from '@ember/utils';
import { alias, reads } from '@ember/object/computed';
import EmberObject, { computed, defineProperty } from '@ember/object';
import { inject as service } from '@ember/service';
import humanize from "ember-form-builder/utilities/humanize";
import guessType from "ember-form-builder/utilities/guess-type";
import byDefault from 'ember-form-builder/utilities/by-default';
import { once } from '@ember/runloop';

const extension = {
  layout,

  translationService: service("formBuilderTranslations"),
  hasFocusedOut: false,
  as: byDefault("_model", "attr", function() {
    return guessType(this.get("_model"), this.get("attr"), this);
  }),
  attr: null,

  type:           reads('as'),
  wrapper:        'default',
  object:         reads('builder.object'),
  _model:         reads('builder.model'),
  modelName:      reads('builder.modelName'),
  configuration:  reads('builder.configuration'),

  builder: computed({
    set(key, value) {
      if (value && value.builder) {
        return value.builder;
      } else {
        return value;
      }
    }
  }),

  focusOut() {
    once(this, this.set, 'hasFocusedOut', true);
  },

  canValidate: byDefault('hasFocusedOut', 'builder.isValid', function() {
    return this.get('hasFocusedOut') || !this.get('builder.isValid');
  }),

  init() {
    this._super(...arguments);

    defineProperty(this, 'validations', reads(`builder.validations.${this.get('attr')}`));

    var valueAttribute = "object." + this.get("attr");
    defineProperty(this, "value", computed(valueAttribute, {
      get: function() {
        return this.get(valueAttribute);
      },
      set: function(key, value) {
        this.set(valueAttribute, value);
        return value;
      }
    }));
  },

  additionalAttributeNames: computed("attrs", function() {
    let additionalAttributeNames = [];

    for(let key in this.get("attrs")) {
      if (simpleInputAttributeNames.indexOf(key) < 0) {
        additionalAttributeNames.push(key);
      }
    }

    return additionalAttributeNames;
  }),

  config: computed('additionalAttributeNames.[]', function() {
    let attrs = (this.additionalAttributeNames || []).concat([
      'inputElementId', 'name', 'value', 'label', 'placeholder', 'hint',
      'validations', 'canValidate'
    ]);
    return EmberObject.extend(
      ...attrs.map((key) => ({
        [key]: alias(`content.${key}`)
      }))
    ).create({ content: this });
  }),

  inputElementId: byDefault("elementId", function() {
    return this.get("elementId") + "Input";
  }),

  name: computed('builder.name', 'attr', function() {
    var prefix = this.get('builder.name');
    var name = this.get('attr');
    if (isPresent(prefix)) {
      name = prefix + '[' + name + ']';
    }
    return name;
  }),

  label: byDefault("builder.translationKey", "attr", 'translationService.locale', function() {
    var key = this.get("builder.translationKey") + ".attributes." + this.get("attr");

    var result;
    if (this.get("translationService").exists(key)) {
      result = this.get("translationService").t(key);
    }
    if (isEmpty(result)) {
      result = humanize(this.get("attr"));
    }
    return result;
  }),

  hint: byDefault("builder.translationKey", "attr", 'translationService.locale', function() {
    var key = this.get("builder.translationKey") + ".hints." + this.get("attr");

    if (this.get("translationService").exists(key)) {
      return this.get("translationService").t(key);
    }
  }),

  placeholder: byDefault("builder.translationKey", "attr", 'translationService.locale', function() {
    var key = this.get("builder.translationKey") + ".placeholders." + this.get("attr");

    if (this.get("translationService").exists(key)) {
      return this.get("translationService").t(key);
    }
  })
};

let simpleInputAttributeNames = Object.keys(extension).concat(["builder", "attr"]);
const SimpleInput = Component.extend(extension);

SimpleInput.reopenClass({
  positionalParams: ["attr"]
});

export default SimpleInput;
