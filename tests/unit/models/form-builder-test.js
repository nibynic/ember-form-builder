import Ember from "ember";
import { test, moduleFor } from "ember-qunit";
import FormBuilder from "ember-simple-form/models/form-builder";

test("it updates status to success when created or updated", function(assert) {
  var model = Ember.Object.extend(Ember.Evented).create();
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
  var model = Ember.Object.extend(Ember.Evented).create();
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
  var model = Ember.Object.extend(Ember.Evented).create({ isSaving: false });
  var builder = FormBuilder.create({
    model: model
  });

  assert.equal(builder.get("isLoading"), false);

  model.set("isSaving", true);
  assert.equal(builder.get("isLoading"), true);
});

test("validate() performs validation on the object and on the nested fields", function(assert) {
  var isValid = false;
  var nestedIsValid = false;
  var validationPerformed = false;
  var nestedValidationWasPerformed = false;
  var model = Ember.Object.create({
    validate() {
      validationPerformed = true;
      return new Ember.RSVP.Promise(function(resolve, reject) {
        if (isValid) {
          resolve();
        } else {
          reject();
        }
      });
    }
  });
  var nestedModel = Ember.Object.create({
    validate() {
      nestedValidationWasPerformed = true;
      return new Ember.RSVP.Promise(function(resolve, reject) {
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

  Ember.run(function() {
    builder.validate();
  });


  assert.ok(validationPerformed, "Validation was performed");
  assert.ok(!builder.get("isValid"), "Form was invalid");

  nestedIsValid = true;

  Ember.run(function() {
    builder.validate();
  });

  assert.ok(!builder.get("isValid"), "Form was invalid");

  isValid = true;
  nestedIsValid = false;

  Ember.run(function() {
    builder.validate();
  });

  assert.ok(!builder.get("isValid"), "Form was invalid");

  isValid = true;
  nestedIsValid = true;

  Ember.run(function() {
    builder.validate();
  });

  assert.ok(builder.get("isValid"), "Form was valid");
});
