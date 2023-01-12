import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { resolve, reject } from 'rsvp';
import sinon from 'sinon';
import { get } from '@ember/object';
import { tracked } from '@glimmer/tracking';

module('Unit | ValidationAdapter | EmberValidations', function (hooks) {
  setupTest(hooks);

  class ObjectStub {
    @tracked errors;
    @tracked warnings;
    @tracked validations;
  }

  hooks.beforeEach(async function () {
    this.object = new ObjectStub();
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
    this.object.errors = {
      firstName: ['cannot be blank'],
    };
    this.object.warnings = {
      firstName: ['should start with a capital letter'],
    };

    assert.deepEqual(get(this, 'adapter.attributes.firstName.errors'), [
      'cannot be blank',
    ]);
    assert.deepEqual(get(this, 'adapter.attributes.firstName.warnings'), [
      'should start with a capital letter',
    ]);
  });

  test('it maps required fields', function (assert) {
    this.object.validations = {
      firstName: {
        presence: true,
      },
    };

    assert.true(get(this, 'adapter.attributes.firstName.required'));
  });

  test('it maps number validations', function (assert) {
    this.object.validations = {
      age: {
        numericality: {
          greaterThan: 1,
          greaterThanOrEqualTo: 2,
          lessThan: 3,
          lessThanOrEqualTo: 4,
          onlyInteger: true,
        },
      },
    };

    assert.deepEqual(get(this, 'adapter.attributes.age.number'), {
      gt: 1,
      gte: 2,
      lt: 3,
      lte: 4,
      integer: true,
    });
  });
});
