import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';
import { resolve } from 'rsvp';
import { get } from '@ember/object';
import { tracked } from '@glimmer/tracking';

module('Unit | ValidationAdapter | EmberCpValidations', function (hooks) {
  setupTest(hooks);

  class ObjectStub {
    @tracked validations;
  }

  hooks.beforeEach(async function () {
    this.object = new ObjectStub();
    this.adapter = this.owner
      .factoryFor('validation-adapter:ember-cp-validations')
      .create({
        object: this.object,
      });
  });

  test('it wraps validate() method', async function (assert) {
    this.object.validate = sinon.stub().returns(
      resolve({
        validations: { isValid: true },
      })
    );
    let didResolve = sinon.stub();
    let didReject = sinon.stub();
    await this.adapter.validate().then(didResolve, didReject);

    assert.ok(didResolve.calledOnce);
    assert.ok(didReject.notCalled);

    this.object.validate = sinon.stub().returns(
      resolve({
        validations: { isValid: false },
      })
    );
    didResolve.reset();
    didReject.reset();
    await this.adapter.validate().then(didResolve, didReject);

    assert.ok(didReject.calledOnce);
    assert.ok(didResolve.notCalled);
  });

  test('it maps errors and warnings', function (assert) {
    this.object.validations = {
      attrs: {
        firstName: {
          messages: ['cannot be blank'],
          warningMessages: ['should start with a capital letter'],
        },
      },
    };
    
    assert.deepEqual(get(this, 'adapter.attributes.firstName.errors'), [
      'cannot be blank',
    ]);
    assert.deepEqual(get(this, 'adapter.attributes.firstName.warnings'), [
      'should start with a capital letter',
    ]);
  });

  test('it maps required fields', function (assert) {
    this.set('object.validations', {
      attrs: {
        firstName: {
          options: {
            presence: { presence: true },
          },
        },
      },
    });

    assert.true(get(this, 'adapter.attributes.firstName.required'));

    this.set(
      'object.validations.attrs.firstName.options.presence.disabled',
      true
    );

    assert.false(get(this, 'adapter.attributes.firstName.required'));
  });

  test('it maps number validations', function (assert) {
    this.set('object.validations', {
      attrs: {
        age: {
          options: {
            number: { gt: 1, gte: 2, lt: 3, lte: 4, integer: true },
          },
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

    this.set('object.validations.attrs.age.options.number.disabled', true);

    assert.strictEqual(get(this, 'adapter.attributes.age.number'), undefined);
  });
});
