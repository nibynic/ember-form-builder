import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';
import Service from '@ember/service';

module('Unit | Service | FormBuilderTranslations', function (hooks) {
  setupTest(hooks);

  class IntlStub extends Service {
    t = sinon.stub().callsFake((k) => `t:${k}`);
    exists = sinon.stub();
  }

  class I18nStub extends Service {}

  test('it exists', function (assert) {
    let service = this.owner.lookup('service:form-builder-translations');
    assert.ok(service);
  });

  test('Defaults to ember-i18n when both i18n and ember-intl are present', function (assert) {
    this.owner.register('service:i18n', I18nStub);
    this.owner.register('service:intl', IntlStub);
    let i18n = this.owner.lookup('service:i18n');
    let service = this.owner.lookup('service:form-builder-translations');

    assert.equal(service.translationService, i18n);
  });

  test('it finds translations for given scope and type', function (assert) {
    this.owner.register('service:intl', IntlStub);
    let intl = this.owner.lookup('service:intl');
    let service = this.owner.lookup('service:form-builder-translations');

    intl.exists.returns(true);

    assert.equal(
      service.t('post', 'attribute', 'title'),
      't:post.attributes.title'
    );
    assert.equal(
      service.t('components.myForm', 'hint', 'url'),
      't:components.myForm.hints.url'
    );
    assert.equal(
      service.t('user.admin', 'action', 'submit'),
      't:user.admin.actions.submit'
    );

    intl.exists.callsFake((k) => !!k.match('formBuilder'));

    assert.equal(
      service.t('post', 'attribute', 'title'),
      't:formBuilder.attributes.title'
    );
    assert.equal(
      service.t('components.myForm', 'hint', 'url'),
      't:formBuilder.hints.url'
    );
    assert.equal(
      service.t('user.admin', 'action', 'submit'),
      't:formBuilder.actions.submit'
    );
    assert.equal(
      service.t('formBuilder.isRequired'),
      't:formBuilder.isRequired'
    );

    intl.exists.returns(false);

    assert.equal(service.t('post', 'attribute', 'title'), undefined);
    assert.equal(service.t('components.myForm', 'hint', 'url'), undefined);
    assert.equal(service.t('user.admin', 'action', 'submit'), undefined);
  });
});
