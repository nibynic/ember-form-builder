import Ember from "ember";
import { test, moduleForComponent } from "ember-qunit";
import FormBuilder from "ember-form-builder/models/form-builder";

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
    builder: formBuilder
  });

  Ember.run(function() {
    component.appendTo("#ember-testing");
  });

  assert.equal(component.$().prop("tagName"), "BUTTON");
  assert.equal(component.$().prop("type"), "submit");
  assert.equal(component.$().text().replace(/\s/, ""), "Save");
});

test("it translates some attributes", function(assert) {
  model.constructor.modelName = null;
  var component = this.subject({
    builder: formBuilder
  });


  assert.equal(component.get("text"), "Save");

  var translations = {
    "article.actions.submit": "Zapisz artykuł",
    "post.actions.submit": "Zapisz post",
    "some.weird.submit.translation.key": "Zapisz dziw",
    "formBuilder.actions.submit": "Zapisz"
  };

  component.set("i18n", { t: function(key) {
      return translations[key] || "missing-translation " + key;
  }, exists: function(key) {
    return !!translations[key];
  } });
  // We don't expect i18n to appear during runtime in real life
  component.notifyPropertyChange("text");

  assert.equal(component.get("text"), "Zapisz");

  model.constructor.modelName = "post";
  // We don't expect model constructor changes in real life
  formBuilder.notifyPropertyChange("translationKey");

  assert.equal(component.get("text"), "Zapisz post");

  formBuilder.set("translationKey", "article");

  assert.equal(component.get("text"), "Zapisz artykuł");

  formBuilder.set("translationKey", "inexistentKey");

  assert.equal(component.get("text"), "Zapisz");

  component.set("translation", "some.weird.submit.translation.key");

  assert.equal(component.get("text"), "Zapisz dziw");
});

test("it is disabled when the form builder is loading", function(assert) {
  formBuilder.set("isLoading", false);
  var component = this.subject({
    builder: formBuilder
  });

  Ember.run(function() {
    component.appendTo("#ember-testing");
  });

  assert.equal(component.get("isDisabled"), false, "is not disabled");
  assert.equal(component.$().prop("disabled"), false, "has no disabled attribute");

  Ember.run(function() {
    formBuilder.set("isLoading", true);
  });

  assert.equal(component.get("isDisabled"), true, "is disabled");
  assert.equal(component.$().prop("disabled"), true, "has disabled attribute");
});
