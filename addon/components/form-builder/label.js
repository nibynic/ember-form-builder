import classic from 'ember-classic-decorator';
import { attributeBindings, tagName, layout as templateLayout } from '@ember-decorators/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import layout from '../../templates/components/form-builder/label';

@classic
@templateLayout(layout)
@tagName("label")
@attributeBindings("for")
export default class Label extends Component {
  @service("formBuilderTranslations")
  translationService;

  @computed('translationService.locale')
  get requiredText() {
    return this.get('translationService').t('formBuilder.isRequired') || 'Required';
  }
}
