import Ember from "ember";

export default Ember.Component.extend({
  tagName: "button",
  type: "submit",
  attributeBindings: ["type"],

  builder: Ember.computed.alias("on"),

  text: Ember.computed("builder.translationKey", "translation", function() {
    var key;

    if (Ember.isPresent(this.get("translation"))) {
      key = this.get("translation");
    } else if (Ember.isPresent(this.get("builder.translationKey"))) {
      key = this.get("builder.translationKey") + ".actions.submit";
    } else {
      key = "simpleForm.actions.submit";
    }

    var result;
    if (Ember.I18n && Ember.I18n.exists(key)) { result = Ember.I18n.t(key); }
    if (Ember.isEmpty(result)) { result = "Save"; }
    return result;
  })
});
