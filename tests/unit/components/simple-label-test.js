import { defineProperty, computed } from '@ember/object';
import { module, test } from 'qunit';
import { setupTest } from "ember-qunit";

module("Simple Label component", function(hooks) {
  setupTest(hooks);

  test("it translates some attributes", function(assert) {
    var component = this.owner.factoryFor('component:simple-label').create({
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
});
