import { defineProperty, computed } from '@ember/object';
import { module, test } from 'qunit';
import { setupTest } from "ember-qunit";

module("Unit | Service | formBuilderTranslation", function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test("it exists", function (assert) {
    let service = this.owner.lookup("service:form-builder-translations");
    assert.ok(service);
  });

  test("Defaults to ember-i18n when both i18n and ember-intl are present", function(assert) {
    let service = this.owner.lookup("service:form-builder-translations");
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

    let service = this.owner.lookup("service:form-builder-translations");
    let key = "testTranslationKey";

    defineProperty(service, "translationService", computed(function() {
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
});
