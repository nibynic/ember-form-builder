import Ember from "ember";
import { test, moduleForComponent } from "ember-qunit";
import FormBuilder from "ember-simple-form/models/form-builder";
import configuration from "ember-simple-form/configuration";

var type = "string";
var defaultTypes = ["string", "text", "boolean", "number", "date"];
var attr = "title";
var formBuilder;
var model;

moduleForComponent("simple-input", "Simple Input component", {
  needs: defaultTypes.map(function(t) {
    return "component:inputs/" + t + "-input";
  }),

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

test("it renders with the right props", function(assert) {
  var component = this.subject({
    on: formBuilder,
    as: type,
    attr: attr
  });

  assert.equal(component._state, "preRender");

  this.render();

  assert.equal(component._state, "inDOM");
});

test("it reflects value updates", function(assert) {
  var component = this.subject({
    on: formBuilder,
    as: type,
    attr: attr
  });

  Ember.run(function() {
    component.appendTo("#ember-testing");
  });

  assert.equal(component.$("input").val(), "Testing testing 123");

  Ember.run(function() {
    model.set("title", "Another test!");
  });

  assert.equal(component.$("input").val(), "Another test!");
});

test("it reflects error updates", function(assert) {
  var component = this.subject({
    on: formBuilder,
    as: type,
    attr: attr
  });

  Ember.run(function() {
    component.appendTo("#ember-testing");
  });

  assert.ok(!component.get("hasErrors"), "Component has no errors.");
  assert.ok(!component.$().is(".field-with-errors"), "Wrapper element has no error class assigned.");
  assert.equal(component.$(".errors").text(), "", "No errors are displayed");
  // assert.equal(component.$("input").val(), "Testing testing 123");

  Ember.run(function() {
    model.set("errors", Ember.Object.create({
      title: Ember.A(["can't be blank", "is too short"])
    }));
  });

  assert.ok(component.get("hasErrors"), "Component has errors.");
  assert.ok(component.$().is(".field-with-errors"), "Wrapper element has an error class assigned.");
  assert.equal(component.$(".errors").text(), "can't be blank, is too short", "The errora are displayed");
});

test("it humanizes the property for use as label", function(assert) {
  var component = this.subject({
    on: formBuilder,
    as: type,
    attr: "multiWordAttribute"
  });

  Ember.run(function() {
    component.appendTo("#ember-testing");
  });

  assert.equal(component.get("label"), "Multi word attribute");
  assert.equal(component.$("label").text(), "Multi word attribute", "The humanized label test is rendered");
});

test("it uses the provided label if it's provided", function(assert) {
  var component = this.subject({
    on: formBuilder,
    as: type,
    attr: attr,
    label: "Custom title"
  });

  Ember.run(function() {
    component.appendTo("#ember-testing");
  });

  assert.equal(component.get("label"), "Custom title");
  assert.equal(component.$("label").text(), "Custom title", "The custom label test is rendered");
});

test("it renders assigns the input's id as the label's for", function(assert) {
  var component = this.subject({
    on: formBuilder,
    as: type,
    attr: attr
  });

  Ember.run(function() {
    component.appendTo("#ember-testing");
  });

  assert.equal(component.$("label").attr("for"), component.$("input").attr("id"));
});

test("it renders the label differently when it's inline", function(assert) {
  var component = this.subject({
    on: formBuilder,
    as: type,
    attr: attr
  });

  Ember.run(function() {
    component.appendTo("#ember-testing");
  });

  assert.equal(component.$("label+.field").length, 1, "The label is rendered before the field");

  Ember.run(function() {
    component.set("inlineLabel", true);
  });

  assert.equal(component.$("input+label").length, 1, "The label is after the input");
});

defaultTypes.forEach(function(type) {
  test("it renders correctly for type \"" + type + "\"", function(assert) {
    var component = this.subject({
      on: formBuilder,
      as: type,
      attr: attr
    });

    Ember.run(function() {
      component.appendTo("#ember-testing");
    });

    assert.equal(
      component.$("#" + component.get("inputElementId")).length,
      1,
      "Rendered correctly for type \"" + type + "\""
    );
  });
});
