import { isPresent, isEmpty } from '@ember/utils';
import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

const SimpleSubmit = Component.extend({
  translationService: service("formBuilderTranslations"),
  tagName: "button",
  type: "submit",
  attributeBindings: ["type", "isDisabled:disabled"],

  isDisabled: oneWay("builder.isLoading"),
  builder: computed({
    set(key, value) {
      if (value && value.builder) {
        return value.builder;
      } else {
        return value;
      }
    }
  }),

  text: computed("builder.translationKey", "translation", function() {
    var key;
    var defaultKey = "formBuilder.actions.submit";

    if (isPresent(this.get("translation"))) {
      key = this.get("translation");
    } else if (isPresent(this.get("builder.translationKey"))) {
      key = this.get("builder.translationKey") + ".actions.submit";
    } else {
      key = defaultKey;
    }

    var result;
    if (this.get("translationService").exists(key)) {
      result = this.get("translationService").t(key);
    } else if (this.get("translationService").exists(defaultKey)) {
      result = this.get("translationService").t(defaultKey);
    }
    if (isEmpty(result)) { result = "Save"; }
    return result;
  })
});

SimpleSubmit.reopenClass({
  positionalParams: ["builder"]
});

export default SimpleSubmit;
