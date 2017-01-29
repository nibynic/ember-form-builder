import Ember from "ember";

export default Ember.Component.extend({
  translationService: Ember.inject.service("formBuilderTranslations"),
  tagName: "label",
  configuration: {
    labelClass: "label" // needs to mirror the config layout in simple-input
  },
  classNames: Ember.computed.alias("configuration.labelClass"),
  attributeBindings: ["for"],
  init() {
    // TODO: put this config logic into a service
    let config = Ember.getOwner(this).resolveRegistration("config:environment");
    let formBuilderConfig = config["formBuilder"];
    if (!Ember.isEmpty(formBuilderConfig)) this.set("configuration", formBuilderConfig);
  },

  requiredText: Ember.computed(function() {
    var result;
    var key = "formBuilder.isRequired";
    if (this.get("translationService").exists(key)) {
      result = this.get("translationService").t(key);
    }
    if (Ember.isEmpty(result)) { result = "Required"; }
    return result;
  })
});
