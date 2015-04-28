import Ember from "ember";
import humanize from "ember-simple-form/utilities/humanize";
import guessType from "ember-simple-form/utilities/guess-type";

var extension = {
  // TODO: assertions
  class: null,
  classNameBindings: ["wrapperClassName", "wrapperTypeClassName"],
  hasFocusedOut: false,
  on: null,
  as: Ember.computed("_model", "attr", function() {
    return guessType(this.get("_model"), this.get("attr"), this);
  }),
  attr: null,
  configuration: {},

  builder: Ember.computed.alias("on"),
  type: Ember.computed.alias("as"),
  object: Ember.computed.alias("builder.object"),
  _model: Ember.computed.alias("builder.model"),

  init: function() {
    this._super();

    this.objectOrAttrChanged();
  },

  focusOut: function() {
    this.set("hasFocusedOut", true);
  },

  setupClassNameBindings: Ember.on("init", function() {
    this.classNameBindings.push("hasErrors:" + this.get("configuration.wrapperWithErrorsClass"));
    this.classNameBindings.push("hasUnit:" + this.get("configuration.wrapperWithUnitClass"));
  }),

  isRequired: Ember.computed("model", "attr", function() {
    var presenceValidator = this.get("object.validations." + this.get("attr"));
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
    var binding = Ember.Binding.from(errorsAttribute).to("errors");
    binding.connect(this);

    var valueAttribute = "object." + this.get("attr");
    Ember.defineProperty(this, "value", Ember.computed(valueAttribute, function(key, value) {
      if (arguments.length > 1) {
        this.set(valueAttribute, value);
      }

      return this.get(valueAttribute);
    }));
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

  label: Ember.computed("builder.translationKey", "attr", "labelTranslation", function() {
    var key;

    if (Ember.isPresent(this.get("labelTranslation"))) {
      key = this.get("labelTranslation");
    } else {
      key = this.get("builder.translationKey") + ".attributes." + this.get("attr");
    }

    var result;
    if (Ember.I18n && Ember.I18n.exists(key)) { result = Ember.I18n.t(key); }
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

    if (Ember.I18n && Ember.I18n.exists(key)) { return Ember.I18n.t(key); }
  }),
};

var simpleInputAttributeNames = Ember.keys(extension);

export default Ember.Component.extend(extension);
export {
  simpleInputAttributeNames
};
