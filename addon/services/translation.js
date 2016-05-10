import Ember from "ember";

export default Ember.Service.extend({
  i18n: Ember.inject.service(),
  intl: Ember.inject.service(),
  translationServices: Ember.computed.collect("i18n", "intl"),
  hasTranslationService: Ember.computed.notEmpty("translationServices"),
  activeTranslationServices: Ember.computed("translationServices", function() {
    return this.get("hasTranslationService") ? Ember.A() : this.get("translationServices").compact();
  }),
  translationService: Ember.computed.alias("activeTranslationServices.firstObject")
});
