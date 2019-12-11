import Service from '@ember/service';
import { A } from '@ember/array';
import { reads } from '@ember/object/computed';
import { getOwner } from '@ember/application';
import { computed } from '@ember/object';
import { pluralize } from 'ember-inflector';


export default Service.extend({
  i18n: computed(function() {
    return getOwner(this).lookup("service:i18n");
  }),

  intl: computed(function() {
    return getOwner(this).lookup("service:intl");
  }),

  translationService: computed('i18n', 'intl', function() {
    return A([this.get('i18n'), this.get('intl')]).compact()[0];
  }),

  t(scope, kind, name) {
    let service = this.get('translationService');
    if (service) {
      let key = [
        A([scope, pluralize(kind), name]).compact().join('.'),
        A(['formBuilder', pluralize(kind), name]).compact().join('.')
      ].find(
        (key) => service.exists(key)
      );
      return key ? service.t(key) : undefined;
    } else {
      return null;
    }
  },

  locale: reads('translationService.locale')
});
