import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import Service from '@ember/service';
import { A } from '@ember/array';
import { getOwner } from '@ember/application';
import { pluralize } from 'ember-inflector';


@classic
export default class FormBuilderTranslationsService extends Service {
  @computed
  get i18n() {
    return getOwner(this).lookup("service:i18n");
  }

  @computed
  get intl() {
    return getOwner(this).lookup("service:intl");
  }

  @computed('i18n', 'intl')
  get translationService() {
    return A([this.get('i18n'), this.get('intl')]).compact()[0];
  }

  t(scope, kind, name) {
    this.locale;
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
  }

  @reads('translationService.locale')
  locale;
}
