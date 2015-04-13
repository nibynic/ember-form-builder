import Ember from "ember";
import { test, moduleForComponent } from "ember-qunit";
import FormBuilder from "ember-simple-form/models/form-builder";

var formBuilder;
var model;

moduleForComponent("simple-submit", "Simple Submit component", {
  beforeEach: function() {
    model = Ember.Object.create({ title: "Testing testing 123" });
    formBuilder = FormBuilder.create({
      object: model
    });
  },

  afterEach: function() {
    model = null;
    formBuilder = null;
  }
});

test("it renders a submit button", function(assert) {
  var component = this.subject({
    on: formBuilder
  });

  Ember.run(function() {
    component.appendTo("#ember-testing");
  });

  assert.equal(component.$().prop("tagName"), "BUTTON");
  assert.equal(component.$().prop("type"), "submit");
  assert.equal(component.$().text().replace(/\s/, ""), "Save");
});
