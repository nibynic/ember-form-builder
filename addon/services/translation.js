import Ember from "ember";

export default Ember.Service.extend({
  i18n: Ember.inject.service(),
  intl: Ember.inject.service(),
  translationServices: Ember.computed.collect("i18n", "intl"),
  hasTranslationService: Ember.computed.notEmpty("translationServices"),
  activeTranslationServices: Ember.computed("translationServices", function() {
    return this.get("hasTranslationService") ? this.get("translationServices").compact() : Ember.A();
  }),
  translationService: Ember.computed.alias("activeTranslationServices.firstObject"),
  exists() {
    return this.get("hasTranslationService") ? this.get("translationService").exists(...arguments) : false;
  },
  t() {
    return this.get("hasTranslationService") ? this.get("translationService").t(...arguments) : false;
  }
});
