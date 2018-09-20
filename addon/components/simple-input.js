import Component from '@ember/component';
import { isArray } from '@ember/array';
import { isEmpty, isPresent } from '@ember/utils';
import { on } from '@ember/object/evented';
import { alias, reads } from '@ember/object/computed';
import EmberObject, {
  computed,
  observer,
  defineProperty
} from '@ember/object';
import { inject as service } from '@ember/service';
import humanize from "ember-form-builder/utilities/humanize";
import guessType from "ember-form-builder/utilities/guess-type";
import { dasherize } from '@ember/string';
import { pluralize } from 'ember-inflector';

const extension = {
  translationService: service("formBuilderTranslations"),
  // TODO: assertions
  class: null,
  classNameBindings: ["wrapperClassName", "wrapperTypeClassName", 'attributeClassName',
    'modelClassName'],
  hasFocusedOut: false,
  as: computed("_model", "attr", function() {
    return guessType(this.get("_model"), this.get("attr"), this);
  }),
  attr: null,
  configuration: {},

  type: alias("as"),
  object: alias("builder.object"),
  _model: alias("builder.model"),
  modelName: alias("builder.modelName"),
  builder: computed({
    set(key, value) {
      if (value && value.builder) {
        return value.builder;
      } else {
        return value;
      }
    }
  }),

  init: function() {
    this._super();

    this.objectOrAttrChanged();
  },

  focusOut: function() {
    this.set("hasFocusedOut", true);
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

  isRequired: computed("validations.presence", function() {
    var presenceValidator = this.get("validations.presence");
    return presenceValidator && !presenceValidator.soft;
  }),

  canValidate: computed("hasFocusedOut", "builder.isValid", function() {
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

  objectOrAttrChanged: observer("object", "attr", function() {
    var errorsAttribute = this.get('builder').errorsPathFor(this.get('attr'));
    defineProperty(this, "errors", reads(errorsAttribute));

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
  }),

  additionalAttributeNames: computed("attrs", function() {
    let additionalAttributeNames = [];

    for(let key in this.get("attrs")) {
      if (simpleInputAttributeNames.indexOf(key) < 0) {
        additionalAttributeNames.push(key);
      }
    }

    return additionalAttributeNames;
  }),

  additionalAttributes: computed("additionalAttributeNames.[]", function() {
    let proxy = EmberObject.create({ content: this });
    if (isArray(this.get("additionalAttributeNames"))) {
      this.get("additionalAttributeNames").forEach((attributeName) => {
        defineProperty(proxy, attributeName, alias(`content.${attributeName}`));
      });
    }
    return proxy;
  }),

  wrapperClassName: computed(function() { return this.get("configuration.wrapperClass"); }),
  wrapperTypeClassName: computed("type", function() {
    return this.get("type") + "-input";
  }),
  unitClassName: computed(function() { return this.get("configuration.unitClass"); }),
  errorsClassName: computed(function() { return this.get("configuration.errorsClass"); }),
  fieldClassName: computed(function() { return this.get("configuration.fieldClass"); }),
  inputClassName: computed(function() { return this.get("configuration.inputClass"); }),
  hintClassName: computed(function() { return this.get("configuration.hintClass"); }),
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

  inputElementId: computed("elementId", function() {
    return this.get("elementId") + "Input";
  }),

  inputName: computed("modelName", "attr", "index", function() {
    var modelName = this.get("modelName");
    var name = this.get("attr");
    var index = this.get("index");
    if (isPresent(modelName)) {
      if (isPresent(index)) {
        modelName = pluralize(modelName) + "[" + index + "]";
      }
      name = modelName + "[" + name + "]";
    }
    return name;
  }),

  label: computed("builder.translationKey", "attr", "labelTranslation", function() {
    var key;

    if (isPresent(this.get("labelTranslation"))) {
      key = this.get("labelTranslation");
    } else {
      key = this.get("builder.translationKey") + ".attributes." + this.get("attr");
    }

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

  inlineLabel: computed("type", function() {
    return this.get("type") === "boolean";
  }),

  hasInlineLabel: computed("inlineLabel", "label", function() {
    return this.get("inlineLabel") && this.get("label") !== false;
  }),

  hasHint: computed("hint", function() {
    return isPresent(this.get("hint"));
  }),

  hint: computed("builder.translationKey", "attr", "hintTranslation", function() {
    var key;

    if (isPresent(this.get("hintTranslation"))) {
      key = this.get("hintTranslation");
    } else {
      key = this.get("builder.translationKey") + ".hints." + this.get("attr");
    }

    if (this.get("translationService").exists(key)) {
      return this.get("translationService").t(key);
    }
  }),

  placeholder: computed("builder.translationKey", "attr", "placeholderTranslation", function() {
    var key;

    if (isPresent(this.get("placeholderTranslation"))) {
      key = this.get("placeholderTranslation");
    } else {
      key = this.get("builder.translationKey") + ".placeholders." + this.get("attr");
    }

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
