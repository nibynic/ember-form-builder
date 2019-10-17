import { isEmpty } from '@ember/utils';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  translationService: service("formBuilderTranslations"),
  tagName: "label",
  attributeBindings: ["for"],

  requiredText: computed('translationService.locale', function() {
    var result;
    var key = "formBuilder.isRequired";
    if (this.get("translationService").exists(key)) {
      result = this.get("translationService").t(key);
    }
    if (isEmpty(result)) { result = "Required"; }
    return result;
  })
});
