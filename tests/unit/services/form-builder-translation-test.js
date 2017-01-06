import { moduleFor, test } from "ember-qunit";
import Ember from "ember";

moduleFor("service:form-builder-translations", "Unit | Service | formBuilderTranslation", {
  // Specify the other units that are required for this test.
  // needs: ["service:foo"]
});

// Replace this with your real tests.
test("it exists", function (assert) {
  let service = this.subject();
  assert.ok(service);
});

test("Defaults to ember-i18n when both i18n and ember-intl are present", function(assert) {
  let service = this.subject();
  let intl = "ember-intl";
  let i18n = "i18n";
  service.setProperties({
    i18n: i18n,
    intl: intl
  });
  assert.equal(service.get("translationService"), i18n);
});

test("Forwards the t and exists methods", function(assert) {
  assert.expect(2, "Both functions are forwarded");

  let service = this.subject();
  let key = "testTranslationKey";

  Ember.defineProperty(service, "translationService", Ember.computed(function() {
    return {
      t(k) {
        assert.equal(k, key, `The t method is called with the given key`);
      },
      exists(k) {
        assert.equal(k, key, `The exists method is called with the given key`);
      }
    };
  }));

  service.exists(key);
  service.t(key);
});
