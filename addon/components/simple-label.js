import Ember from "ember";

export default Ember.Component.extend({
  tagName: "label",
  attributeBindings: ["for"],

  requiredText: Ember.computed(function() {
    var result;
    var key = "simpleForm.isRequired";
    if (Ember.I18n && Ember.I18n.exists(key)) { result = Ember.I18n.t(key); }
    if (Ember.isEmpty(result)) { result = "Required"; }
    return result;
  })
});
