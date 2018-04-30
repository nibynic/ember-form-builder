import { A } from '@ember/array';
import { collect, reads, notEmpty } from '@ember/object/computed';
import { getOwner } from '@ember/application';
import { computed } from '@ember/object';
import Service from '@ember/service';

export default Service.extend({
  i18n: computed(function() {
    let owner = getOwner(this);
    return owner.lookup("service:i18n");
  }),

  intl: computed(function() {
    let owner = getOwner(this);
    return owner.lookup("service:intl");
  }),

  translationServices: collect("i18n", "intl"),

  activeTranslationServices: computed("translationServices.@each", function() {
    return A(this.get("translationServices").compact());
  }),

  translationService: reads("activeTranslationServices.firstObject"),

  hasTranslationService: notEmpty("translationService"),

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
