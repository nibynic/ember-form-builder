import { A } from '@ember/array';
import EmberObject, { computed } from '@ember/object';
import { test } from "ember-qunit";
import guessType from "ember-form-builder/utilities/guess-type";

var object = EmberObject.create();
var input = EmberObject.create();

test("it detects password by attribute", function(assert) {
  assert.equal(guessType(object, "password", input), "password");
  assert.equal(guessType(object, "passwordConfirmation", input), "password");
  assert.equal(guessType(object, "currentPassword", input), "password");
});

test("it detects email by attribute", function(assert) {
  assert.equal(guessType(object, "email", input), "email");
  assert.equal(guessType(object, "emailConfirmation", input), "email");
});

test("it detects boolean by attribute", function(assert) {
  assert.equal(guessType(object, "isNice", input), "boolean");
  assert.equal(guessType(object, "hasMustache", input), "boolean");
  assert.equal(guessType(object, "didWashHimself", input), "boolean");
});

test("it detects collection when a collection param is available", function(assert) {
  input = EmberObject.create({ collection: A() });
  assert.equal(guessType(object, "role", input), "collection");
  input = EmberObject.create();
});

test("it recognizes Ember Data attribute types", function(assert) {
  A(["string", "number", "date", "boolean"]).forEach(function(type) {
    object = EmberObject.extend({
      someProperty: computed(function() { }).meta({ type: type })
    }).create();

    assert.equal(guessType(object, "someProperty", input), type);
    object = EmberObject.create();
  });
});

test("it returns 'string' by default", function(assert) {
  object = EmberObject.create();

  assert.equal(guessType(object, "role", input), "string");

  object = EmberObject.create();
});
