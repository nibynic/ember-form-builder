import { module, test } from 'qunit';
import { setupTest } from "ember-qunit";
import sinon from 'sinon';
import EmberObject from '@ember/object';

module("Unit | Service | FormBuilderTranslations", function(hooks) {
  setupTest(hooks);

  test("it exists", function (assert) {
    let service = this.owner.lookup("service:form-builder-translations");
    assert.ok(service);
  });

  test("Defaults to ember-i18n when both i18n and ember-intl are present", function(assert) {
    let intl = "ember-intl";
    let i18n = "i18n";
    let service = this.owner.lookup("service:form-builder-translations");
    service.reopen({
      i18n: i18n,
      intl: intl
    });
    assert.equal(service.get("translationService"), i18n);
  });

  test('it finds translations for given scope and type', function(assert) {
    let exists = sinon.stub();
    let t = sinon.stub().callsFake((k) => k);
    this.owner.register('service:intl', EmberObject.extend({ t, exists }));
    let service = this.owner.lookup('service:form-builder-translations');

    exists.returns(true);

    assert.equal(service.t('post', 'attribute', 'title'), 'post.attributes.title');
    assert.equal(service.t('components.myForm', 'hint', 'url'), 'components.myForm.hints.url');
    assert.equal(service.t('user.admin', 'action', 'submit'), 'user.admin.actions.submit');

    exists.callsFake((k) => !!k.match('formBuilder'));

    assert.equal(service.t('post', 'attribute', 'title'), 'formBuilder.attributes.title');
    assert.equal(service.t('components.myForm', 'hint', 'url'), 'formBuilder.hints.url');
    assert.equal(service.t('user.admin', 'action', 'submit'), 'formBuilder.actions.submit');
    assert.equal(service.t('formBuilder.isRequired'), 'formBuilder.isRequired');

    exists.returns(false);

    assert.equal(service.t('post', 'attribute', 'title'), undefined);
    assert.equal(service.t('components.myForm', 'hint', 'url'), undefined);
    assert.equal(service.t('user.admin', 'action', 'submit'), undefined);
  });
});
