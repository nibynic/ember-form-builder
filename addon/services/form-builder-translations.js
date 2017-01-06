import Ember from "ember";

export default Ember.Service.extend({
  i18n: Ember.computed(function() {
    let owner = Ember.getOwner(this);
    return owner.lookup("service:i18n");
  }),

  intl: Ember.computed(function() {
    let owner = Ember.getOwner(this);
    return owner.lookup("service:intl");
  }),

  translationServices: Ember.computed.collect("i18n", "intl"),

  activeTranslationServices: Ember.computed("translationServices.@each", function() {
    return Ember.A(this.get("translationServices").compact());
  }),

  translationService: Ember.computed.reads("activeTranslationServices.firstObject"),

  hasTranslationService: Ember.computed.notEmpty("translationService"),

  exists() {
    if (this.get("hasTranslationService")) {
      return this.get("translationService").exists(...arguments);
    } else {
      return false;
    }
  },

  t() {
    if (this.get("hasTranslationService")) {
      return this.get("translationService").t(...arguments);
    } else {
      return false;
    }
  }
});
