import { defineProperty, computed } from '@ember/object';
import { test, moduleForComponent } from "ember-qunit";

moduleForComponent("simple-label", "Simple Label component", {
  needs: ["service:formBuilderTranslations"],
  unit: true
});

test("it translates some attributes", function(assert) {
  var component = this.subject({
    for: "someElementId",
    isRequired: true
  });

  assert.equal(component.get("requiredText"), "Required");

  var translations = {
    "formBuilder.isRequired": "Wymagane"
  };

  defineProperty(component, "translationService", computed(function() {
    return {
      t(key) {
        return translations[key] || "missing-translation " + key;
      },
      exists(key) {
        return !!translations[key];
      }
    };
  }));

  // We don't expect i18n to appear during runtime in real life
  component.notifyPropertyChange("requiredText");

  assert.equal(component.get("requiredText"), "Wymagane");
});
