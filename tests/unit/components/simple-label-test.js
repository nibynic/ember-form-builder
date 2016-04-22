import { test, moduleForComponent } from "ember-qunit";

moduleForComponent("simple-label", "Simple Label component", { });

test("it translates some attributes", function(assert) {
  var component = this.subject({
    for: "someElementId",
    isRequired: true
  });

  assert.equal(component.get("requiredText"), "Required");

  var translations = {
    "formBuilder.isRequired": "Wymagane"
  };

  component.set("i18n", { t: function(key) {
      return translations[key] || "missing-translation " + key;
  }, exists: function(key) {
    return !!translations[key];
  } });

  // We don't expect i18n to appear during runtime in real life
  component.notifyPropertyChange("requiredText");

  assert.equal(component.get("requiredText"), "Wymagane");
});
