import Ember from "ember";
import { test, moduleForComponent } from "ember-qunit";

moduleForComponent("form-builder");

test("it renders with the right props", function(assert) {
  var component = this.subject();

  assert.equal(component._state, "preRender");

  this.render();

  assert.equal(component._state, "inDOM");
});

test("it inserts a form tag into DOM", function(assert) {
  var component = this.subject();
  this.render();

  assert.ok(component.$().is("form"));
});

test("it handles submit", function(assert) {
  var validationPerformed = false;
  var submitActionSent = false;
  var submitFailedActionSent = false;
  var isValid = false;

  var object = Ember.Object.create();
  var targetObject = Ember.Object.create({
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
    targetObject: targetObject
  });
  component.get("formBuilder").validate = function() {
    validationPerformed = true;
    this.set("isValid", isValid);
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (isValid) {
        resolve();
      } else {
        reject();
      }
    });
  };

  this.render();

  component.$().trigger("submit");

  assert.ok(validationPerformed, "Validation was performed");
  assert.ok(submitFailedActionSent, "Submit failed action was sent");
  assert.ok(!component.get("formBuilder.isValid"), "Form was invalid");

  isValid = true;
  component.$().trigger("submit");

  assert.ok(submitActionSent, "Submit action was sent");
  assert.ok(component.get("formBuilder.isValid"), "Form was valid");
});
