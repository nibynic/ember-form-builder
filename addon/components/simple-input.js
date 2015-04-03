import Ember from "ember";
import configuration from "ember-simple-form/configuration";
import humanize from "ember-simple-form/utilities/humanize";

export default Ember.Component.extend({
  // TODO: assertions

  classNameBindings: ["wrapperClassName", "wrapperTypeClassName"],

  builder: Ember.computed.alias("on"),
  type: Ember.computed.alias("as"),
  object: Ember.computed.alias("builder.object"),

  setupClassNameBindings: function() {
    this.classNameBindings.push("hasErrors:" + configuration.wrapperWithErrorsClass);
  }.on("init"),

  hasErrors: function() {
    return !Ember.isEmpty(this.get("errors"));
  }.property("errors"),

  errorMessages: function() {
    return this.get("errors").join(", ");
  }.property("errors"),

  objectOrAttrChanged: function() {
    var errorsAttribute = "object.errors." + this.get("attr");
    var binding = Ember.Binding.from(errorsAttribute).to("errors");
    binding.connect(this);

    var valueAttribute = "object." + this.get("attr");
    Ember.defineProperty(this, "value", Ember.computed(function(key, value) {
      if (arguments.length > 1) {
        this.set(valueAttribute, value);
      }

      return this.get(valueAttribute);
    }).property(valueAttribute));
  }.observes("object", "attr").on("init"),

  wrapperClassName: function() { return configuration.wrapperClass; }.property(),
  wrapperTypeClassName: function() {
    return this.get("type") + "-input";
  }.property("type"),
  errorsClassName: function() { return configuration.errorsClass; }.property(),
  fieldClassName: function() { return configuration.fieldClass; }.property(),
  inputClassName: function() { return configuration.inputClass; }.property(),
  hintClassName: function() { return configuration.hintClass; }.property(),

  inputComponentName: function() {
    return "inputs/" + this.get("type") + "-input";
  }.property("attr", "builder"),

  inputElementId: function() {
    return this.get("elementId") + "Input";
  }.property("elementId"),

  label: function() {
    return humanize(this.get("attr"));
  }.property("attr"),

  inlineLabel: function() {
    return this.get("type") === "boolean";
  }.property("type"),

  hasHint: function() {
    return Ember.isPresent(this.get("hint"));
  }.property("hint")
});
