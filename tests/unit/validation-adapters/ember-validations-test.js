import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { resolve, reject } from 'rsvp';
import sinon from 'sinon';

module('Unit | ValidationAdapter | EmberValidations', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(async function() {
    this.object = {};
    this.adapter = this.owner.factoryFor('validation-adapter:ember-validations').create({
      object: this.object
    });
  });

  test('it wraps validate() method', async function(assert) {
    this.object.validate = sinon.stub().returns(resolve());
    let didResolve = sinon.stub();
    let didReject = sinon.stub();
    await this.adapter.validate().then(didResolve, didReject);

    assert.ok(didResolve.calledOnce);
    assert.ok(didReject.notCalled);

    this.object.validate = sinon.stub().returns(reject());
    didResolve.reset();
    didReject.reset();
    await this.adapter.validate().then(didResolve, didReject);

    assert.ok(didReject.calledOnce);
    assert.ok(didResolve.notCalled);
  });

  test('it maps errors and warnings', function(assert) {
    this.set('object.errors', {
      firstName: ['cannot be blank']
    });
    this.set('object.warnings', {
      firstName: ['should start with a capital letter']
    });

    assert.deepEqual(this.get('adapter.attributes.firstName.errors'), ['cannot be blank']);
    assert.deepEqual(this.get('adapter.attributes.firstName.warnings'), ['should start with a capital letter']);
  });

  test('it maps required fields', function(assert) {
    this.set('object.validations', {
      firstName: {
        presence: true
      }
    });

    assert.equal(this.get('adapter.attributes.firstName.required'), true);
  });

  test('it maps number validations', function(assert) {
    this.set('object.validations', {
      age: {
        numericality: {
          greaterThan: 1,
          greaterThanOrEqualTo: 2,
          lessThan: 3,
          lessThanOrEqualTo: 4,
          onlyInteger: true
        }
      }
    });

    assert.deepEqual(this.get('adapter.attributes.age.number'), { gt: 1, gte: 2, lt: 3, lte: 4, integer: true });
  });





  // test("provides errors path for a given attribute", function(assert) {
  //   var model = EmberObject.create();
  //   var builder = FormBuilder.create({
  //     model: model
  //   });
  //   assert.equal(builder.errorsPathFor('firstName'), 'object.errors.firstName');
  // });
  //
  // test("provides validations path for a given attribute", function(assert) {
  //   var model = EmberObject.create();
  //   var builder = FormBuilder.create({
  //     model: model
  //   });
  //   assert.equal(builder.validationsPathFor('firstName'), 'object.validations.firstName');
  // });
  //
  // test("normalizes validations", function(assert) {
  //   var model = EmberObject.create();
  //   var builder = FormBuilder.create({
  //     model: model
  //   });
  //   assert.deepEqual(builder.normalizeValidations({
  //     presence: true,
  //     numericality: {
  //       greaterThan: 1,
  //       greaterThanOrEqualTo: 2,
  //       lessThan: 3,
  //       lessThanOrEqualTo: 4,
  //       onlyInteger: true
  //     }
  //   }), {
  //     required: true,
  //     number: { gt: 1, gte: 2, lt: 3, lte: 4, integer: true }
  //   });
  // });
  //
  // test("provides normalized validate()", async function(assert) {
  //   var object = EmberObject.create({
  //     validate: reject
  //   });
  //   var builder = FormBuilder.create({
  //     object: object,
  //     model: {}
  //   });
  //
  //   assert.expect(2);
  //
  //   await builder.validateObject().then(() => {
  //     assert.ok(false, 'promise should not be resolved when model is invalid');
  //   }, () => {
  //     assert.ok(true, 'promise should be rejected when model is invalid');
  //   });
  //
  //   object.validate = resolve;
  //   await builder.validateObject().then(() => {
  //     assert.ok(true, 'promise should be resolved when model is valid');
  //   }, () => {
  //     assert.ok(false, 'promise should not be rejected when model is valid');
  //   });
  // });
});
