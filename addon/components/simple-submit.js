import Ember from "ember";

export default Ember.Component.extend({
  tagName: "button",
  type: "submit",
  attributeBindings: ["type"],

  builder: Ember.computed.alias("on"),

  text: Ember.computed("builder.translationKey", "translation", function() {
    var key;
    var defaultKey = "simpleForm.actions.submit";

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
