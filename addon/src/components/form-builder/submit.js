import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class Submit extends Component {
  @service('formBuilderTranslations') translationService;

  get builder() {
    return (
      (this.args.builder && this.args.builder.builder) || this.args.builder
    );
  }

  get text() {
    return (
      this.args.text ||
      this.translationService.t(
        this.builder && this.builder.translationKey,
        'action',
        'submit'
      ) ||
      'Save'
    );
  }
}
