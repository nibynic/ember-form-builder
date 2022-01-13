import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { resolve, reject } from 'rsvp';
import sinon from 'sinon';
import { get } from '@ember/object';

module('Unit | ValidationAdapter | EmberValidations', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(async function () {
    this.object = {};
    this.adapter = this.owner
      .factoryFor('validation-adapter:ember-validations')
      .create({
        object: this.object,
      });
  });

  test('it wraps validate() method', async function (assert) {
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

  test('it maps errors and warnings', function (assert) {
    this.set('object.errors', {
      firstName: ['cannot be blank'],
    });
    this.set('object.warnings', {
      firstName: ['should start with a capital letter'],
    });

    assert.deepEqual(get(this, 'adapter.attributes.firstName.errors'), [
      'cannot be blank',
    ]);
    assert.deepEqual(get(this, 'adapter.attributes.firstName.warnings'), [
      'should start with a capital letter',
    ]);
  });

  test('it maps required fields', function (assert) {
    this.set('object.validations', {
      firstName: {
        presence: true,
      },
    });

    assert.equal(get(this, 'adapter.attributes.firstName.required'), true);
  });

  test('it maps number validations', function (assert) {
    this.set('object.validations', {
      age: {
        numericality: {
          greaterThan: 1,
          greaterThanOrEqualTo: 2,
          lessThan: 3,
          lessThanOrEqualTo: 4,
          onlyInteger: true,
        },
      },
    });

    assert.deepEqual(get(this, 'adapter.attributes.age.number'), {
      gt: 1,
      gte: 2,
      lt: 3,
      lte: 4,
      integer: true,
    });
  });
});
