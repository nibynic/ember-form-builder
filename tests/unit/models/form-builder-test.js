import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { resolve, reject } from 'rsvp';
import Evented from '@ember/object/evented';
import EmberObject from '@ember/object';
import FormBuilder from "ember-form-builder/models/form-builder";
import sinon from 'sinon';

module('Unit | Models | FormBuilder', function(hooks) {
  setupTest(hooks);

  test("it updates status to success when created or updated", function(assert) {
    var modelClass = EmberObject.extend(Evented);
    modelClass.reopenClass({modelName: "fake-model"});
    var model = modelClass.create();
    var builder = FormBuilder.create({
      model: model
    });

    assert.equal(builder.get("status"), null);

    model.trigger("didCreate");
    assert.equal(builder.get("status"), "success");

    model.set("status", null);
    model.trigger("didUpdate");
    assert.equal(builder.get("status"), "success");
  });

  test("it updates status to failure when became invalid", function(assert) {
    var modelClass = EmberObject.extend(Evented);
    modelClass.reopenClass({modelName: "fake-model"});
    var model = modelClass.create();
    var builder = FormBuilder.create({
      model: model
    });

    assert.equal(builder.get("status"), null);
    assert.ok(builder.get("isValid"));

    model.trigger("becameInvalid");
    assert.equal(builder.get("status"), "failure");
    assert.ok(!builder.get("isValid"));
  });

  test("it is loading when the model is saving", function(assert) {
    var model = EmberObject.extend(Evented).create({ isSaving: false });
    var builder = FormBuilder.create({
      model: model
    });

    assert.equal(builder.get("isLoading"), false);

    model.set("isSaving", true);
    assert.equal(builder.get("isLoading"), true);
  });

  test("isLoading can be overriden by object property", function(assert) {
    var model = EmberObject.extend(Evented).create({ isSaving: true });
    var object = EmberObject.extend(Evented).create({ isLoading: false });
    var builder = FormBuilder.create({
      model: model,
      object: object
    });

    assert.equal(builder.get("isLoading"), false);

    object.set("isLoading", true);
    assert.equal(builder.get("isLoading"), true);
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
