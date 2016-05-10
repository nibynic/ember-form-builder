import Ember from "ember";
import humanize from "ember-form-builder/utilities/humanize";
import guessType from "ember-form-builder/utilities/guess-type";

const extension = {
  translationService: Ember.inject.service(),
  // TODO: assertions
  class: null,
  classNameBindings: ["wrapperClassName", "wrapperTypeClassName"],
  hasFocusedOut: false,
  as: Ember.computed("_model", "attr", function() {
    return guessType(this.get("_model"), this.get("attr"), this);
  }),
  attr: null,
  configuration: {},

  type: Ember.computed.alias("as"),
  object: Ember.computed.alias("builder.object"),
  _model: Ember.computed.alias("builder.model"),
  modelName: Ember.computed.alias("builder.modelName"),
  builder: Ember.computed({
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

  setupClassNameBindings: Ember.on("init", function() {
    let newBindings = [
      "hasErrors:" + this.get("configuration.wrapperWithErrorsClass"),
      "hasUnit:" + this.get("configuration.wrapperWithUnitClass")
    ];
    let combinedBindings = (this.get("classNameBindings") || []).concat(newBindings);
    this.set("classNameBindings", combinedBindings);
  }),

  validations: Ember.computed("model", "attr", function() {
    return this.get("object.validations." + this.get("attr"));
  }),

  isRequired: Ember.computed("validations.presence", function() {
    var presenceValidator = this.get("validations.presence");
    return presenceValidator && !presenceValidator.soft;
  }),

  hasErrors: Ember.computed("hasFocusedOut", "builder.isValid", "errors", function() {
    return (this.get("hasFocusedOut") || !this.get("builder.isValid")) && !Ember.isEmpty(this.get("errors"));
  }),

  hasUnit: Ember.computed("unit", function() {
    return Ember.isPresent(this.get("unit"));
  }),

  errorMessages: Ember.computed("errors", function() {
    return this.get("errors").join(", ");
  }),

  objectOrAttrChanged: Ember.observer("object", "attr", function() {
    var errorsAttribute = "object.errors." + this.get("attr");
    Ember.defineProperty(this, "errors", Ember.computed.reads(errorsAttribute));

    var valueAttribute = "object." + this.get("attr");
    Ember.defineProperty(this, "value", Ember.computed(valueAttribute, {
      get: function() {
        return this.get(valueAttribute);
      },

      set: function(key, value) {
        this.set(valueAttribute, value);
        return value;
      }
    }));
  }),

  additionalAttributeNames: Ember.computed("attrs", function() {
    let additionalAttributeNames = [];

    for(let key in this.get("attrs")) {
      if (simpleInputAttributeNames.indexOf(key) < 0) {
        additionalAttributeNames.push(key);
      }
    }

    return additionalAttributeNames;
  }),

  additionalAttributes: Ember.computed("additionalAttributeNames.[]", function() {
    let proxy = Ember.Object.create({ content: this });
    if (Ember.isArray(this.get("additionalAttributeNames"))) {
      this.get("additionalAttributeNames").forEach((attributeName) => {
        Ember.defineProperty(proxy, attributeName, Ember.computed.alias(`content.${attributeName}`));
      });
    }
    return proxy;
  }),

  wrapperClassName: Ember.computed(function() { return this.get("configuration.wrapperClass"); }),
  wrapperTypeClassName: Ember.computed("type", function() {
    return this.get("type") + "-input";
  }),
  unitClassName: Ember.computed(function() { return this.get("configuration.unitClass"); }),
  errorsClassName: Ember.computed(function() { return this.get("configuration.errorsClass"); }),
  fieldClassName: Ember.computed(function() { return this.get("configuration.fieldClass"); }),
  inputClassName: Ember.computed(function() { return this.get("configuration.inputClass"); }),
  hintClassName: Ember.computed(function() { return this.get("configuration.hintClass"); }),

  inputComponentName: Ember.computed("attr", "builder", function() {
    return "inputs/" + this.get("type") + "-input";
  }),

  inputElementId: Ember.computed("elementId", function() {
    return this.get("elementId") + "Input";
  }),

  inputName: Ember.computed("modelName", "attr", function() {
    var name = this.get("attr");
    if (Ember.isPresent(this.get("modelName"))) {
      name = this.get("modelName") + "[" + name + "]";
    }

    return name;
  }),

  label: Ember.computed("builder.translationKey", "attr", "labelTranslation", function() {
    var key;

    if (Ember.isPresent(this.get("labelTranslation"))) {
      key = this.get("labelTranslation");
    } else {
      key = this.get("builder.translationKey") + ".attributes." + this.get("attr");
    }

    var result;
    if (this.get("translationService.hasTranslationService") && this.get("translationService.translationService").exists(key)) { result = this.get("translationService.translationService").t(key); }
    if (Ember.isEmpty(result)) { result = humanize(this.get("attr")); }
    return result;
  }),

  hasLabel: Ember.computed("inlineLabel", "label", function() {
    return !this.get("inlineLabel") && this.get("label") !== false;
  }),

  inlineLabel: Ember.computed("type", function() {
    return this.get("type") === "boolean";
  }),

  hasInlineLabel: Ember.computed("inlineLabel", "label", function() {
    return this.get("inlineLabel") && this.get("label") !== false;
  }),

  hasHint: Ember.computed("hint", function() {
    return Ember.isPresent(this.get("hint"));
  }),

  hint: Ember.computed("builder.translationKey", "attr", "hintTranslation", function() {
    var key;

    if (Ember.isPresent(this.get("hintTranslation"))) {
      key = this.get("hintTranslation");
    } else {
      key = this.get("builder.translationKey") + ".hints." + this.get("attr");
    }

    if (this.get("translationService.hasTranslationService") && this.get("translationService.translationService").exists(key)) { return this.get("translationService.translationService").t(key); }
  }),

  placeholder: Ember.computed("builder.translationKey", "attr", "placeholderTranslation", function() {
    var key;

    if (Ember.isPresent(this.get("placeholderTranslation"))) {
      key = this.get("placeholderTranslation");
    } else {
      key = this.get("builder.translationKey") + ".placeholders." + this.get("attr");
    }

    if (this.get("translationService.hasTranslationService") && this.get("translationService.translationService").exists(key)) { return this.get("translationService.translationService").t(key); }
  })
};

let simpleInputAttributeNames = Object.keys(extension).concat(["builder", "attr"]);
const SimpleInput = Ember.Component.extend(extension);

SimpleInput.reopenClass({
  positionalParams: ["attr"]
});

export default SimpleInput;
