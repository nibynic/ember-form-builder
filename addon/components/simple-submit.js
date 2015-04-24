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
    if (Ember.I18n) {
      if (Ember.I18n.exists(key)) {
        result = Ember.I18n.t(key);
      } else if (Ember.I18n.exists(defaultKey)) {
        result = Ember.I18n.t(defaultKey);
      }
    }
    if (Ember.isEmpty(result)) { result = "Save"; }
    return result;
  })
});
