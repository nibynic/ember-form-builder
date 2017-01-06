import Ember from "ember";

export default Ember.Component.extend({
  translationService: Ember.inject.service("formBuilderTranslations"),
  tagName: "label",
  attributeBindings: ["for"],

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
