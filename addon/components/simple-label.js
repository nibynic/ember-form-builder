import Ember from "ember";

export default Ember.Component.extend({
  translationService: Ember.inject.service(),
  tagName: "label",
  attributeBindings: ["for"],

  requiredText: Ember.computed(function() {
    var result;
    var key = "formBuilder.isRequired";
    if (this.get("translationService.hasTranslationService") && this.get("translationService.translationService").exists(key)) { result = this.get("translationService.translationService").t(key); }
    if (Ember.isEmpty(result)) { result = "Required"; }
    return result;
  })
});
