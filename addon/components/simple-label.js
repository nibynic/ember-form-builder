import Ember from "ember";

export default Ember.Component.extend({
  tagName: "label",
  attributeBindings: ["for"],

  requiredText: Ember.computed(function() {
    var result;
    var key = "simpleForm.isRequired";
    if (this.get("i18n") && this.get("i18n").exists(key)) { result = this.get("i18n").t(key); }
    if (Ember.isEmpty(result)) { result = "Required"; }
    return result;
  })
});
