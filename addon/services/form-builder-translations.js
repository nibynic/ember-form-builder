import Service from '@ember/service';
import { A } from '@ember/array';
import { getOwner } from '@ember/application';
import { pluralize } from 'ember-inflector';
import { dependentKeyCompat } from '@ember/object/compat';

export default class FormBuilderTranslationsService extends Service {
  get i18n() {
    return getOwner(this).lookup('service:i18n');
  }

  get intl() {
    return getOwner(this).lookup('service:intl');
  }

  get translationService() {
    return A([this.i18n, this.intl]).compact()[0];
  }

  t(scope, kind, name) {
    this.locale;
    let service = this.translationService;
    if (service) {
      let key = [
        A([scope, pluralize(kind), name])
          .compact()
          .join('.'),
        A(['formBuilder', pluralize(kind), name])
          .compact()
          .join('.'),
      ].find((key) => service.exists(key));
      return key ? service.t(key) : undefined;
    } else {
      return null;
    }
  }

  @dependentKeyCompat
  get locale() {
    return this.translationService?.locale;
  }
}
