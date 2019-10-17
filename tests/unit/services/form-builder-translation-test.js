import { defineProperty, computed } from '@ember/object';
import { module, test } from 'qunit';
import { setupTest } from "ember-qunit";
import sinon from 'sinon';

module("Unit | Service | formBuilderTranslation", function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test("it exists", function (assert) {
    let service = this.owner.lookup("service:form-builder-translations");
    assert.ok(service);
  });

  test("Defaults to ember-i18n when both i18n and ember-intl are present", function(assert) {
    let intl = "ember-intl";
    let i18n = "i18n";
    let service = this.owner.factoryFor("service:form-builder-translations").class.reopen({
      i18n: i18n,
      intl: intl
    }).create();
    assert.equal(service.get("translationService"), i18n);
  });

  test("Forwards the t and exists methods", function(assert) {
    let t = sinon.stub();
    let exists = sinon.stub();

    let service = this.owner.lookup("service:form-builder-translations");
    defineProperty(service, "translationService", computed(function() {
      return { t, exists, locale: 'en' };
    }));

    exists.returns('some result');
    let result = service.exists('some.key');

    assert.equal(exists.getCall(0).args[0], 'some.key');
    assert.equal(result, 'some result');

    t.returns('another result');
    result = service.t('another.key');

    assert.equal(t.getCall(0).args[0], 'another.key');
    assert.equal(result, 'another result');

    assert.equal(service.locale, 'en');
  });
});
