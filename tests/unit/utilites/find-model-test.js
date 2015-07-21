import Ember from "ember";
import { test, moduleForComponent } from "ember-qunit";
import findModel from "ember-simple-form/utilities/find-model";

var trueModel = { constructor: { modelName: "modelName" } };

test("it returns the content or model that have constructor.modelName", function(assert) {
  var object = { content: trueModel };

  assert.equal(findModel(object), trueModel, "True model was found in .content");

  object = { model: trueModel };

  assert.equal(findModel(object), trueModel, "True model was found in .model");
});

test("it searches recursively", function(assert) {
  var object = { content: { content: { model: { content: trueModel } } } };

  assert.equal(findModel(object), trueModel, "True model was found very very deeply");
});

test("ite returns itself when none of the nested objects are a true model", function(assert) {
  var object = { content: { content: { model: { content: "asdf" } } } };

  assert.equal(findModel(object), object, "The object itself is the true model");
});
