import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class Label extends Component {
  @service('formBuilderTranslations') translationService;

  get requiredText() {
    this.translationService.locale;
    return this.translationService.t('formBuilder.isRequired') || 'Required';
  }
}
