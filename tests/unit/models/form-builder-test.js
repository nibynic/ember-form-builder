import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { resolve, reject } from 'rsvp';
import EmberObject from '@ember/object';
import sinon from 'sinon';

module('Unit | Models | FormBuilder', function(hooks) {
  setupTest(hooks);

  test('it provides form builder configuration', function(assert) {
    this.owner.factoryFor('config:environment').class.formBuilder = {
      dataAddon: 'ember-orbit'
    };
    let builder = this.owner.factoryFor('model:form-builder').create();

    assert.equal(builder.configuration.dataAddon, 'ember-orbit'); // overriden value
    assert.equal(builder.configuration.validationsAddon, 'ember-validations'); // default value
  });

  module('model detection', function(hooks) {
    hooks.beforeEach(function() {
      this.model = EmberObject.extend({ type: 'my-model' }).create();
      this.builder = this.owner.factoryFor('model:form-builder').create({
        object: this.model
      });
    });

    test('it uses data adapter specified in the config', function(assert) {
      this.owner.factoryFor('config:environment').class.formBuilder = {
        dataAddon: 'ember-orbit'
      };
      const EmberOrbitAdapter = this.owner.factoryFor('data-adapter:ember-orbit').class;

      assert.ok(this.builder.dataAdapter instanceof EmberOrbitAdapter);
      assert.equal(this.builder.dataAdapter.object, this.model);
    });

    test('it proxies model and model name from the adapter', function(assert) {
      assert.equal(this.builder.model, this.model);
      assert.equal(this.builder.modelName, 'my-model');
    });
  });

  module('validation', function(hooks) {
    hooks.beforeEach(function() {
      this.object = {};
      this.builder = this.owner.factoryFor('model:form-builder').create({
        object: this.object
      });
    });

    test('it uses validation adapter specified in the config', function(assert) {
      this.owner.factoryFor('config:environment').class.formBuilder = {
        validationsAddon: 'ember-cp-validations'
      };
      const EmberCpValidationsAdapter = this.owner.factoryFor('validation-adapter:ember-cp-validations').class;

      assert.ok(this.builder.validationAdapter instanceof EmberCpValidationsAdapter);
      assert.equal(this.builder.validationAdapter.object, this.object);
    });

    test('it performs validation on the adapter', async function(assert) {
      let validateStub = sinon.stub(this.builder.validationAdapter, 'validate').returns(resolve());

      await this.builder.validate();

      assert.ok(this.builder.isValid);
      assert.ok(validateStub.calledOnce);

      validateStub.reset();
      validateStub.returns(reject());
      await assert.rejects(this.builder.validate());

      assert.notOk(this.builder.isValid);
      assert.ok(validateStub.calledOnce);
    });

    test('it performs validation on the nested fields', async function(assert) {
      let child = this.owner.factoryFor('model:form-builder').create();
      let validateStub = sinon.stub(child.validationAdapter, 'validate').returns(resolve());
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
