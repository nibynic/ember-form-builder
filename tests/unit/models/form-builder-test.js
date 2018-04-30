import { run } from '@ember/runloop';
import { Promise as EmberPromise } from 'rsvp';
import Evented from '@ember/object/evented';
import EmberObject from '@ember/object';
import { test } from "ember-qunit";
import FormBuilder from "ember-form-builder/models/form-builder";

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

test("isValid returns the model's validation status by default", function(assert) {
  var model = EmberObject.create({ isValid: true });
  var builder = FormBuilder.create({
    model: model
  });

  assert.equal(builder.get("isValid"), true);

  model.set("isValid", false);

  assert.equal(builder.get("isValid"), false);
});

test("validate() performs validation on the object and on the nested fields", function(assert) {
  var isValid = false;
  var nestedIsValid = false;
  var validationPerformed = false;
  var nestedValidationWasPerformed = false;
  var model = EmberObject.create({
    validate() {
      validationPerformed = true;
      return new EmberPromise(function(resolve, reject) {
        if (isValid) {
          resolve();
        } else {
          reject();
        }
      });
    }
  });
  var nestedModel = EmberObject.create({
    validate() {
      nestedValidationWasPerformed = true;
      return new EmberPromise(function(resolve, reject) {
        if (nestedIsValid) {
          resolve();
        } else {
          reject();
        }
      });
    }
  });
  var builder = FormBuilder.create({
    object: model
  });
  builder.addChild(FormBuilder.create({
    object: nestedModel
  }));

  run(function() {
    builder.validate();
  });


  assert.ok(validationPerformed, "Validation was performed");
  assert.ok(nestedValidationWasPerformed, "Nested validation was performed");
  assert.ok(!builder.get("isValid"), "Form was invalid");

  nestedIsValid = true;

  run(function() {
    builder.validate();
  });

  assert.ok(!builder.get("isValid"), "Form was invalid");

  isValid = true;
  nestedIsValid = false;

  run(function() {
    builder.validate();
  });

  assert.ok(!builder.get("isValid"), "Form was invalid");

  isValid = true;
  nestedIsValid = true;

  run(function() {
    builder.validate();
  });

  assert.ok(builder.get("isValid"), "Form was valid");
});
