import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { resolve, reject } from 'rsvp';
import sinon from 'sinon';

module('Unit | Models | FormBuilder', function (hooks) {
  setupTest(hooks);

  test('it provides form builder configuration', function (assert) {
    this.configStub = sinon
      .stub(this.owner.factoryFor('config:environment').class, 'formBuilder')
      .value({
        dataAddon: 'ember-orbit',
      });
    let builder = this.owner.factoryFor('model:form-builder').create();

    assert.strictEqual(builder.configuration.dataAddon, 'ember-orbit'); // overriden value
    assert.strictEqual(
      builder.configuration.validationsAddon,
      'ember-validations'
    ); // default value

    this.configStub.restore();
  });

  module('hierarchy', function (hooks) {
    hooks.beforeEach(function () {
      this.builder = this.owner.factoryFor('model:form-builder').create({
        settings: {
          modelName: 'post',
          object: { constructor: { modelName: 'myPost' } },
        },
      });
      this.child = this.owner.factoryFor('model:form-builder').create({
        settings: { modelName: 'author' },
      });
      this.builder.addChild(this.child);
      this.grandchild = this.owner.factoryFor('model:form-builder').create({
        settings: { modelName: 'device' },
      });
      this.child.addChild(this.grandchild);
    });

    test('it registers and deregisters children', function (assert) {
      assert.deepEqual(this.builder.children, [this.child]);
      assert.strictEqual(this.child.parent, this.builder);

      this.builder.removeChild(this.child);

      assert.deepEqual(this.builder.children, []);
      assert.strictEqual(this.child.parent, null);
    });

    test('it generates nested names', function (assert) {
      assert.strictEqual(this.child.name, 'post[author]');
      assert.strictEqual(this.grandchild.name, 'post[author][device]');

      this.child.settings.index = 2;

      assert.strictEqual(this.child.name, 'post[authors][2]');
      assert.strictEqual(this.grandchild.name, 'post[authors][2][device]');

      this.builder.set('settings', {
        modelName: undefined,
        object: this.builder.settings.object,
      });

      assert.strictEqual(this.child.name, 'myPost[authors][2]');
      assert.strictEqual(this.grandchild.name, 'myPost[authors][2][device]');

      this.builder.set('settings', { modelName: '' });

      assert.strictEqual(this.child.name, 'authors[2]');
      assert.strictEqual(this.grandchild.name, 'authors[2][device]');
    });

    test('it propagates loading state', function (assert) {
      this.set('builder.settings.isLoading', true);

      assert.true(this.child.isLoading);
      assert.true(this.grandchild.isLoading);
    });
  });

  module('model detection', function (hooks) {
    hooks.beforeEach(function () {
      this.configStub = sinon
        .stub(this.owner.factoryFor('config:environment').class, 'formBuilder')
        .value({
          dataAddon: 'ember-orbit',
        });
      this.model = { type: 'my-model' };
      this.builder = this.owner.factoryFor('model:form-builder').create({
        settings: { object: this.model },
      });
    });

    hooks.afterEach(function () {
      this.configStub.restore();
    });

    test('it uses data adapter specified in the config', function (assert) {
      const EmberOrbitAdapter = this.owner.factoryFor(
        'data-adapter:ember-orbit'
      ).class;

      assert.ok(this.builder.dataAdapter instanceof EmberOrbitAdapter);
      assert.strictEqual(this.builder.dataAdapter.object, this.model);
    });

    test('it proxies model and model name from the adapter', function (assert) {
      assert.strictEqual(this.builder.model, this.model);
      assert.strictEqual(this.builder.modelName, 'my-model');
    });
  });

  module('validation', function (hooks) {
    hooks.beforeEach(function () {
      this.configStub = sinon
        .stub(this.owner.factoryFor('config:environment').class, 'formBuilder')
        .value({
          validationsAddon: 'ember-cp-validations',
        });
      this.object = {};
      this.builder = this.owner.factoryFor('model:form-builder').create({
        settings: { object: this.object },
      });
    });

    hooks.afterEach(function () {
      this.configStub.restore();
    });

    test('it uses validation adapter specified in the config', function (assert) {
      const EmberCpValidationsAdapter = this.owner.factoryFor(
        'validation-adapter:ember-cp-validations'
      ).class;

      assert.ok(
        this.builder.validationAdapter instanceof EmberCpValidationsAdapter
      );
      assert.strictEqual(this.builder.validationAdapter.object, this.object);

      this.configStub.restore();
    });

    test('it performs validation on the adapter', async function (assert) {
      let validateStub = sinon
        .stub(this.builder.validationAdapter, 'validate')
        .returns(resolve());

      await this.builder.validate();

      assert.ok(this.builder.isValid);
      assert.ok(validateStub.calledOnce);

      validateStub.reset();
      validateStub.returns(reject());
      await assert.rejects(this.builder.validate());

      assert.notOk(this.builder.isValid);
      assert.ok(validateStub.calledOnce);
    });

    test('it performs validation on the nested fields', async function (assert) {
      let child = this.owner.factoryFor('model:form-builder').create();
      let validateStub = sinon
        .stub(child.validationAdapter, 'validate')
        .returns(resolve());
      this.builder.addChild(child);
      sinon.stub(this.builder.validationAdapter, 'validate').returns(resolve());

      await this.builder.validate();

      assert.ok(this.builder.isValid);
      assert.ok(validateStub.calledOnce);

      validateStub.reset();
      validateStub.returns(reject());
      await assert.rejects(this.builder.validate());

      assert.notOk(this.builder.isValid);
      assert.ok(validateStub.calledOnce);
    });
  });
});
