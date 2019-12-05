import Component from '@ember/component';
import layout from '../../templates/components/form-builder/label';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  layout,

  translationService: service("formBuilderTranslations"),
  tagName: "label",
  attributeBindings: ["for"],

  requiredText: computed('translationService.locale', function() {
    return this.get('translationService').t('formBuilder.isRequired') || 'Required';
  })
});
