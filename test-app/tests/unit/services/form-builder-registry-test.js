import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import FormBuilderRegistryService from 'ember-form-builder/services/form-builder-registry';
import Component from '@glimmer/component';
import { ensureSafeComponent } from '@embroider/util';

module('Unit | Service | FormBuilderRegistry', function (hooks) {
  setupTest(hooks);

  class TestComponent extends Component {} // eslint-disable-line ember/no-empty-glimmer-component-classes

  hooks.beforeEach(function () {
    this.owner.register(
      'service:form-builder-registry',
      FormBuilderRegistryService
    );
    this.service = this.owner.lookup('service:form-builder-registry');

    this.component = ensureSafeComponent(TestComponent, this);
  });

  test('it registers input component for given type', function (assert) {
    this.service.registerInput('my-type', this.component);

    assert.strictEqual(this.service.resolveInput('my-type'), this.component);
  });

  test('it throws error for unregistered inputs', function (assert) {
    assert.throws(() => this.service.resolveInput('my-type'));
  });

  test('it registers wrapper component for given type', function (assert) {
    this.service.registerWrapper('my-type', this.component);

    assert.strictEqual(this.service.resolveWrapper('my-type'), this.component);
  });

  test('it throws error for unregistered wrappers', function (assert) {
    assert.throws(() => this.service.resolveWrapper('my-type'));
  });
});
