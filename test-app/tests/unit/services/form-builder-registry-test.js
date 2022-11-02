import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import FormBuilderRegistryService from 'ember-form-builder/services/form-builder-registry';

module('Unit | Service | FormBuilderRegistry', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register(
      'service:form-builder-registry',
      FormBuilderRegistryService
    );
    this.service = this.owner.lookup('service:form-builder-registry');
  });

  test('it registers input component for given type', function (assert) {
    const Component = {};
    this.service.registerInput('my-type', Component);

    assert.strictEqual(this.service.resolveInput('my-type'), Component);
  });

  test('it throws error for unregistered inputs', function (assert) {
    assert.throws(() => this.service.resolveInput('my-type'));
  });

  test('it registers wrapper component for given type', function (assert) {
    const Component = {};
    this.service.registerWrapper('my-type', Component);

    assert.strictEqual(this.service.resolveWrapper('my-type'), Component);
  });

  test('it throws error for unregistered wrappers', function (assert) {
    assert.throws(() => this.service.resolveWrapper('my-type'));
  });
});
