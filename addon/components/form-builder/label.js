import Component from '@glimmer/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default class Label extends Component {
  @service('formBuilderTranslations') translationService;

  @computed('translationService.locale')
  get requiredText() {
    return this.translationService.t('formBuilder.isRequired') || 'Required';
  }
}
