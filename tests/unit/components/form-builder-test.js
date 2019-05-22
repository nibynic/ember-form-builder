import { Promise as EmberPromise } from 'rsvp';
import EmberObject from '@ember/object';
import { test, moduleForComponent } from "ember-qunit";

moduleForComponent("form-builder", "Form Builder component", { unit: true });

test("it renders with the right props", function(assert) {
  var component = this.subject();

  assert.equal(component._state, "preRender");

  this.render();

  assert.equal(component._state, "inDOM");
});

test("it sets model name", function(assert) {
  var object = EmberObject.extend().reopenClass({
    modelName: 'default-type'
  }).create();
  var component = this.subject({
    for: object,
    as: 'overriden-type'
  });

  assert.equal(component.get('formBuilder.modelName'), 'overriden-type');
});

test("it allows empty model name", function(assert) {
  var object = EmberObject.extend().reopenClass({
    modelName: 'default-type'
  }).create();
  var component = this.subject({
    for: object,
    as: ''
  });

  assert.equal(component.get('formBuilder.modelName'), '');
  assert.equal(component.get('formBuilder.translationKey'), '');
  assert.equal(component.get('formBuilder.name'), '');
});

test("it sets name", function(assert) {
  var component = this.subject({
    as: 'sample-model'
  });

  assert.equal(component.get('formBuilder.name'), 'sampleModel');

  component.set('index', 0);

  assert.equal(component.get('formBuilder.name'), 'sampleModels[0]');
});

test("it inserts a form tag into DOM", function(assert) {
  var component = this.subject();
  this.render();

  assert.dom(component.element).matchesSelector('form');
});

test("it handles submit", function(assert) {
  var validationPerformed = false;
  var submitActionSent = false;
  var submitFailedActionSent = false;
  var isValid = false;

  var object = EmberObject.create();
  var target = EmberObject.create({
    submit: function() {
      submitActionSent = true;
    },
    submitFailed: function() {
      submitFailedActionSent = true;
    }
  });
  var component = this.subject({
    for: object,
    action: "submit",
    submitFailed: "submitFailed",
    target
  });
  component.get("formBuilder").validate = function() {
    validationPerformed = true;
    this.set("isValid", isValid);
    return new EmberPromise(function(resolve, reject) {
      if (isValid) {
        resolve();
      } else {
        reject();
      }
    });
  };

  this.render();

  component.element.dispatchEvent(new Event('submit', { bubbles: true }));

  assert.ok(validationPerformed, "Validation was performed");
  assert.ok(submitFailedActionSent, "Submit failed action was sent");
  assert.ok(!component.get("formBuilder.isValid"), "Form was invalid");

  isValid = true;
  component.element.dispatchEvent(new Event('submit', { bubbles: true }));

  assert.ok(submitActionSent, "Submit action was sent");
  assert.ok(component.get("formBuilder.isValid"), "Form was valid");
});
