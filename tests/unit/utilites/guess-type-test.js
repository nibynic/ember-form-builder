import Ember from "ember";
import { test } from "ember-qunit";
import guessType from "ember-simple-form/utilities/guess-type";

var object = Ember.Object.create();
var input = Ember.Object.create();

test("it detects password by attribute", function(assert) {
  assert.equal(guessType(object, "password", input), "password");
  assert.equal(guessType(object, "passwordConfirmation", input), "password");
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
  input = Ember.Object.create({ collection: Ember.A() });
  assert.equal(guessType(object, "role", input), "collection");
  input = Ember.Object.create();
});

test("it recognizes Ember Data attribute types", function(assert) {
  Ember.A(["string", "number", "date", "boolean"]).forEach(function(type) {
    object = { };
    object.constructor.metaForProperty = function(p) { return p === "someProperty" && { type: type }; };

    assert.equal(guessType(object, "someProperty", input), type);
    object = Ember.Object.create();
  });
});

test("it returns 'string' by default", function(assert) {
  object = { };
  object.constructor.metaForProperty = function(p) { return false; };

  assert.equal(guessType(object, "role", input), "string");

  object = Ember.Object.create();
});
