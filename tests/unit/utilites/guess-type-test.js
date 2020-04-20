import { module, test } from 'qunit';
import { A } from '@ember/array';
import EmberObject, { computed } from '@ember/object';
import guessType from "ember-form-builder/utilities/guess-type";

module('Unit | Utilities | guesType', function() {

  test("it detects password by attribute", function(assert) {
    assert.equal(guessType({}, { attr: "password" }), "password");
    assert.equal(guessType({}, { attr: "passwordConfirmation" }), "password");
    assert.equal(guessType({}, { attr: "currentPassword" }), "password");
  });

  test("it detects email by attribute", function(assert) {
    assert.equal(guessType({}, { attr: "email" }), "email");
    assert.equal(guessType({}, { attr: "emailConfirmation" }), "email");
  });

  test("it detects boolean by attribute", function(assert) {
    assert.equal(guessType({}, { attr: "isNice" }), "boolean");
    assert.equal(guessType({}, { attr: "hasMustache" }), "boolean");
    assert.equal(guessType({}, { attr: "didWashHimself" }), "boolean");
  });

  test("it detects collection when a collection param is available", function(assert) {
    assert.equal(guessType({}, { attr: "role", collection: A() }), "collection");
  });

  test("it recognizes Ember Data attribute types", function(assert) {
    A(["string", "number", "date", "boolean"]).forEach(function(type) {
      let object = EmberObject.extend({
        someProperty: computed(function() { return undefined; }).meta({ type: type })
      }).create();

      assert.equal(guessType(object, { attr:  "someProperty" }), type);
    });
  });

  test("it returns 'string' by default", function(assert) {
    assert.equal(guessType({}, { attr: "role" }), "string");
  });
});
