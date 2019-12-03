import Component from '@ember/component';
import { isEmpty, isPresent } from '@ember/utils';
import { on } from '@ember/object/evented';
import { alias, reads } from '@ember/object/computed';
import EmberObject, { computed, defineProperty } from '@ember/object';
import { inject as service } from '@ember/service';
import humanize from "ember-form-builder/utilities/humanize";
import guessType from "ember-form-builder/utilities/guess-type";
import byDefault from 'ember-form-builder/utilities/by-default';
import { dasherize } from '@ember/string';
import { once } from '@ember/runloop';

function mergedClass(name) {
  return computed(`${name}Class`, function() {
    return [
      this.get(`configuration.${name}Class`),
      this.get(`${name}Class`)
    ].join(' ');
  })
}

const extension = {
  translationService: service("formBuilderTranslations"),
  // TODO: assertions
  class: null,
  classNameBindings: ["wrapperClassName", "wrapperTypeClassName", 'attributeClassName',
    'modelClassName', 'inlineLabel'],
  hasFocusedOut: false,
  as: byDefault("_model", "attr", function() {
    return guessType(this.get("_model"), this.get("attr"), this);
  }),
  attr: null,
  configuration: {},

  type:       reads("as"),
  object:     reads("builder.object"),
  _model:     reads("builder.model"),
  modelName:  reads("builder.modelName"),
  builder: computed({
    set(key, value) {
      if (value && value.builder) {
        return value.builder;
      } else {
        return value;
      }
    }
  }),

  focusOut: function() {
    once(this, this.handleFocusOut);
  },

  handleFocusOut() {
    this.set('hasFocusedOut', true);
  },

  setupClassNameBindings: on("init", function() {
    let newBindings = [
      "hasErrors:" + this.get("configuration.wrapperWithErrorsClass"),
      "hasUnit:" + this.get("configuration.wrapperWithUnitClass")
    ];
    let combinedBindings = (this.get("classNameBindings") || []).concat(newBindings);
    this.set("classNameBindings", combinedBindings);
  }),

  validations: computed("model", "attr", function() {
    return this.get("object.validations." + this.get("attr"));
  }),

  isRequired: reads("validations.required"),

  canValidate: byDefault("hasFocusedOut", "builder.isValid", function() {
    return this.get("hasFocusedOut") || !this.get("builder.isValid");
  }),

  hasErrors: computed("canValidate", "errors", function() {
    return this.get("canValidate") && !isEmpty(this.get("errors"));
  }),

  hasUnit: computed("unit", function() {
    return isPresent(this.get("unit"));
  }),

  errorMessages: computed("errors", function() {
    return this.get("errors").join(", ");
  }),

  init() {
    this._super(...arguments);

    var errorsAttribute = this.get('builder').errorsPathFor(this.get('attr'));
    defineProperty(this, "errors", reads(errorsAttribute));

    var validationsAttribute = this.get('builder').validationsPathFor(this.get('attr'));
    defineProperty(this, "validations", computed(validationsAttribute, function() {
      return this.get('builder').normalizeValidations(
        this.get(validationsAttribute)
      );
    }));

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

  inputConfig: computed('additionalAttributeNames.[]', function() {
    let attrs = (this.additionalAttributeNames || []).concat([
      'value', 'value', 'inputElementId', 'placeholder', 'name', 'validations'
    ]);
    return EmberObject.extend(
      ...attrs.map((key) => ({
        [key]: alias(`content.${key}`)
      }))
    ).create({ content: this });
  }),

  wrapperClassName: mergedClass('wrapper'),
  wrapperTypeClassName: computed("type", function() {
    return this.get("type") + "-input";
  }),
  unitClassName:    mergedClass('unit'),
  errorsClassName:  mergedClass('errors'),
  fieldClassName:   mergedClass('field'),
  inputClassName:   mergedClass('input'),
  hintClassName:    mergedClass('hint'),
  attributeClassName: computed('attr', function() {
    let attr = this.get('attr');
    return attr ? `${dasherize(attr)}-attr-input` : null;
  }),
  modelClassName: computed('modelName', function() {
    let modelName = this.get('modelName');
    return  modelName ? `${dasherize(modelName)}-model-input` : null;
  }),

  inputComponentName: computed("attr", "builder", function() {
    return "inputs/" + this.get("type") + "-input";
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

  hasLabel: computed("inlineLabel", "label", function() {
    return !this.get("inlineLabel") && this.get("label") !== false;
  }),

  inlineLabel: byDefault("type", function() {
    return this.get("type") === "boolean";
  }),

  hasInlineLabel: computed("inlineLabel", "label", function() {
    return this.get("inlineLabel") && this.get("label") !== false;
  }),

  hasHint: computed("hint", function() {
    return isPresent(this.get("hint"));
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
