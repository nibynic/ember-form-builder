import Ember from "ember";

const SimpleSubmit = Ember.Component.extend({
  i18n: Ember.inject.service(),

  tagName: "button",
  type: "submit",
  attributeBindings: ["type", "isDisabled:disabled"],

  isDisabled: Ember.computed.oneWay("builder.isLoading"),
  builder: Ember.computed({
    set(key, value) {
      if (value && value.builder) {
        return value.builder;
      } else {
        return value;
      }
    }
  }),

  text: Ember.computed("builder.translationKey", "translation", function() {
    var key;
    var defaultKey = "formBuilder.actions.submit";

    if (Ember.isPresent(this.get("translation"))) {
      key = this.get("translation");
    } else if (Ember.isPresent(this.get("builder.translationKey"))) {
      key = this.get("builder.translationKey") + ".actions.submit";
    } else {
      key = defaultKey;
    }

    var result;
    if (this.get("i18n")) {
      if (this.get("i18n").exists(key)) {
        result = this.get("i18n").t(key);
      } else if (this.get("i18n").exists(defaultKey)) {
        result = this.get("i18n").t(defaultKey);
      }
    }
    if (Ember.isEmpty(result)) { result = "Save"; }
    return result;
  })
});

SimpleSubmit.reopenClass({
  positionalParams: ["builder"]
});

export default SimpleSubmit;
