import Ember from "ember";
import { test, moduleForComponent } from "ember-qunit";
import FormBuilder from "ember-simple-form/models/form-builder";

moduleForComponent("simple-label", "Simple Label component", { });

test("it translates some attributes", function(assert) {
  var component = this.subject({
    for: "someElementId",
    isRequired: true
  });

  assert.equal(component.get("requiredText"), "Required");

  var translations = {
    "simpleForm.isRequired": "Wymagane"
  };

  Ember.I18n = { t: function(key) {
      return translations[key] || "missing-translation " + key;
  }, exists: function(key) {
    return !!translations[key];
  } };

  // We don't expect Ember.I18n to appear during runtime in real life
  component.notifyPropertyChange("requiredText");

  assert.equal(component.get("requiredText"), "Wymagane");

  Ember.I18n = null;
});
