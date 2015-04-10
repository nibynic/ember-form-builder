import Ember from "ember";
import configuration from "ember-simple-form/configuration";
import humanize from "ember-simple-form/utilities/humanize";

var extension = {
  // TODO: assertions
  classNameBindings: ["wrapperClassName", "wrapperTypeClassName"],
  on: null,
  as: null,
  attr: null,

  builder: Ember.computed.alias("on"),
  type: Ember.computed.alias("as"),
  object: Ember.computed.alias("builder.object"),

  init: function() {
    this._super();

    this.objectOrAttrChanged();
  },

  setupClassNameBindings: Ember.on("init", function() {
    this.classNameBindings.push("hasErrors:" + configuration.wrapperWithErrorsClass);
  }),

  hasErrors: Ember.computed("errors", function() {
    return !Ember.isEmpty(this.get("errors"));
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

  wrapperClassName: Ember.computed(function() { return configuration.wrapperClass; }),
  wrapperTypeClassName: Ember.computed("type", function() {
    return this.get("type") + "-input";
  }),
  errorsClassName: Ember.computed(function() { return configuration.errorsClass; }),
  fieldClassName: Ember.computed(function() { return configuration.fieldClass; }),
  inputClassName: Ember.computed(function() { return configuration.inputClass; }),
  hintClassName: Ember.computed(function() { return configuration.hintClass; }),

  inputComponentName: Ember.computed("attr", "builder", function() {
    return "inputs/" + this.get("type") + "-input";
  }),

  inputElementId: Ember.computed("elementId", function() {
    return this.get("elementId") + "Input";
  }),

  label: Ember.computed("attr", function() {
    return humanize(this.get("attr"));
  }),

  inlineLabel: Ember.computed("type", function() {
    return this.get("type") === "boolean";
  }),

  hasHint: Ember.computed("hint", function() {
    return Ember.isPresent(this.get("hint"));
  })
};

var simpleInputAttributeNames = Ember.keys(extension);

export default Ember.Component.extend(extension);
export {
  simpleInputAttributeNames
};
