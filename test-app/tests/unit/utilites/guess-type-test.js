/* eslint-disable ember/no-classic-classes */

import { module, test } from 'qunit';
import { A } from '@ember/array';
import EmberObject, { computed } from '@ember/object';
import guessType from 'ember-form-builder/utilities/guess-type';

module('Unit | Utilities | guesType', function () {
  test('it detects password by attribute', function (assert) {
    assert.strictEqual(guessType({}, { attr: 'password' }), 'password');
    assert.strictEqual(
      guessType({}, { attr: 'passwordConfirmation' }),
      'password'
    );
    assert.strictEqual(guessType({}, { attr: 'currentPassword' }), 'password');
  });

  test('it detects email by attribute', function (assert) {
    assert.strictEqual(guessType({}, { attr: 'email' }), 'email');
    assert.strictEqual(guessType({}, { attr: 'emailConfirmation' }), 'email');
  });

  test('it detects boolean by attribute', function (assert) {
    assert.strictEqual(guessType({}, { attr: 'isNice' }), 'boolean');
    assert.strictEqual(guessType({}, { attr: 'hasMustache' }), 'boolean');
    assert.strictEqual(guessType({}, { attr: 'didWashHimself' }), 'boolean');
  });

  test('it detects collection when a collection param is available', function (assert) {
    assert.strictEqual(
      guessType({}, { attr: 'role', collection: A() }),
      'collection'
    );
  });

  test('it recognizes Ember Data attribute types', function (assert) {
    assert.expect(4);
    A(['string', 'number', 'date', 'boolean']).forEach(function (type) {
      let object = EmberObject.extend({
        someProperty: computed(function () {
          return undefined;
        }).meta({ type: type }),
      }).create();

      assert.strictEqual(guessType(object, { attr: 'someProperty' }), type);
    });
  });

  test("it returns 'string' by default", function (assert) {
    assert.strictEqual(guessType({}, { attr: 'role' }), 'string');
  });
});
