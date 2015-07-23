import Ember from "ember";
import { test, moduleForComponent } from "ember-qunit";
import FormBuilder from "ember-simple-form/models/form-builder";
import configurationInitialiser from "../../../initializers/ember-simple-form-configuration";
import keywordsInitialiser from "../../../initializers/ember-simple-form-keywords";

var type = "string";
var defaultTypes = ["string", "text", "boolean", "number", "date", "password", "email", "tel"];
var attr = "title";
var formBuilder;
var model;

configurationInitialiser.initialize();
keywordsInitialiser.initialize();

var dependencies = defaultTypes.map(function(t) {
  return "component:inputs/" + t + "-input";
});
dependencies.push("component:simple-label");
dependencies.push("template:components/simple-label");

moduleForComponent("simple-input", "Simple Input component", {
  needs: dependencies,

  beforeEach: function() {
    model = Ember.Object.create({ title: "Testing testing 123" });
    formBuilder = FormBuilder.create({
      object: model
    });
  },

  afterEach: function() {
    model = null;
    formBuilder = null;
    Ember.I18n = null;
  }
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

test("it renders input name", function(assert) {
  model.constructor.modelName = "post";
  var component = this.subject({
    on: formBuilder,
    as: type,
    attr: attr
  });

  Ember.run(function() {
    component.appendTo("#ember-testing");
  });

  assert.equal(component.$("input").attr("name"), "post[title]");
});

test("it uses the classes from configuration", function(assert) {
  var component = this.subject({
    on: formBuilder,
    as: type,
    attr: attr
  });

  Ember.run(function() {
    component.appendTo("#ember-testing");
  });

  assert.ok(component.$().is(".input"), "Wrapper element has the configured wrapper class.");
  assert.ok(component.$().is(".string-input"), "Wrapper element has a type-based class.");
  assert.equal(component.$(".field").length, 1, "Field element has the configured class.");
  assert.ok(component.$("input").is(".input-control"), "Wrapper element has a type-based class.");
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
  assert.ok(!component.$().is(".input-with-errors"), "Wrapper element has no error class assigned.");
  assert.equal(component.$(".errors").text(), "", "No errors are displayed");
  // assert.equal(component.$("input").val(), "Testing testing 123");

  Ember.run(function() {
    model.set("errors", Ember.Object.create({
      title: Ember.A(["can't be blank", "is too short"])
    }));
  });

  assert.ok(!component.get("hasErrors"), "Component has no errors if wasn't focused out.");
  assert.ok(!component.$().is(".input-with-errors"), "Wrapper element has no error class assigned if wasn't focused out.");
  assert.equal(component.$(".errors").text(), "", "No errors are displayed if wasn't focused out");

  Ember.run(function() {
    formBuilder.set("isValid", false);
  });

  assert.ok(component.get("hasErrors"), "Component has errors when builder is invalid.");
  assert.ok(component.$().is(".input-with-errors"), "Wrapper element has an error class assigned when builder is invalid.");
  assert.equal(component.$(".errors").text(), "can't be blank, is too short", "The errors are displayed when builder is invalid");

  Ember.run(function() {
    formBuilder.set("isValid", true);
  });

  assert.ok(!component.get("hasErrors"), "Just to be sure it stopped displaying errors.");

  Ember.run(function() {
    component.focusOut();
  });

  assert.ok(component.get("hasErrors"), "Component has errors.");
  assert.ok(component.$().is(".input-with-errors"), "Wrapper element has an error class assigned.");
  assert.equal(component.$(".errors").text(), "can't be blank, is too short", "The errors are displayed");
});

test("it renders a hint when provided", function(assert) {
  var component = this.subject({
    on: formBuilder,
    as: type,
    attr: attr
  });

  Ember.run(function() {
    component.appendTo("#ember-testing");
  });

  assert.ok(!component.get("hasHint"));
  assert.equal(component.$(".hint").length, 0);

  Ember.run(function() {
    component.set("hint", "This is a hint");
  });

  assert.ok(component.get("hasHint"));
  assert.equal(component.$(".hint").text(), "This is a hint");
});

test("it renders a placeholder when provided", function(assert) {
  var component = this.subject({
    on: formBuilder,
    as: type,
    attr: attr
  });

  Ember.run(function() {
    component.appendTo("#ember-testing");
  });

  assert.equal(component.$("input").attr("placeholder"), undefined);

  Ember.run(function() {
    component.set("placeholder", "This is a placeholder");
  });

  assert.equal(component.$("input").attr("placeholder"), "This is a placeholder");
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
  assert.equal(component.$("label").text().replace(/^\s/, "").replace(/\s$/, ""), "Multi word attribute", "The humanized label test is rendered");
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
  assert.equal(component.$("label").text().replace(/^\s/, "").replace(/\s$/, ""), "Custom title", "The custom label test is rendered");
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

  assert.equal(component.$("label>input").length, 1, "The label contains the input");
});

test("it renders no label when it's set to false", function(assert) {
  var component = this.subject({
    on: formBuilder,
    as: type,
    attr: attr,
    label: false
  });

  Ember.run(function() {
    component.appendTo("#ember-testing");
  });

  assert.equal(component.$("label").length, 0, "There is no label in regular layout");

  Ember.run(function() {
    component.set("inlineLabel", true);
  });

  assert.equal(component.$("label").length, 0, "There is no label in inline layout");
});

test("it renders the required mark", function(assert) {
  model.set("validations", { "name": { "presence": {} } });
  var component = this.subject({
    on: formBuilder,
    as: type,
    attr: "name"
  });

  Ember.run(function() {
    component.appendTo("#ember-testing");
  });

  assert.ok(component.get("isRequired"), "Is required");
  assert.equal(component.$("label abbr").text(), "*");
  assert.equal(component.$("label abbr").attr("title"), "Required");
});

test("it renders unit when it's provided", function(assert) {
  var component = this.subject({
    on: formBuilder,
    as: type,
    attr: "name"
  });

  Ember.run(function() {
    component.appendTo("#ember-testing");
  });

  assert.ok(!component.get("hasUnit"), "Has no unit");
  assert.ok(!component.$().is(".has-unit"), "Has no has-unit class");
  assert.equal(component.$(".input-unit").length, 0, "Unit was not rendered");

  Ember.run(function() {
    component.set("unit", "PLN");
  });

  assert.ok(component.get("hasUnit"), "Has unit");
  assert.ok(component.$().is(".has-unit"), "Has has-unit class");
  assert.equal(component.$(".input-unit").text(), "PLN");
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

test("it passes all external attributes to the input component", function(assert) {
  var component = this.subject({
    on: formBuilder,
    as: type,
    attr: attr,
    customAttr1: "asdf",
    collection: ["a", "b", "c"],
    inputAttributeNames: ["customAttr1", "collection"]
  });

  Ember.run(function() {
    component.appendTo("#ember-testing");
  });

  assert.ok(component.get("inputAttributeNames").indexOf("customAttr1") > -1);
  assert.ok(component.get("inputAttributeNames").indexOf("collection") > -1);
});

test("it translates some attributes", function(assert) {
  model.constructor.modelName = null;
  var component = this.subject({
    on: formBuilder,
    as: type,
    attr: attr,
    t: null
  });

  assert.equal(component.get("label"), "Title", "Label was humanized without translation function");
  assert.equal(component.get("hint"), null, "Hint was omitted without translation function");

  var translations = {
    "article.attributes.title": "Tytuł artykułu",
    "article.hints.title": "Maksymalnie 255 znaków",
    "article.placeholders.title": "Wpisz tytuł",
    "blogPost.attributes.title": "Tytuł posta",
    "blogPost.hints.title": "Maksymalnie 45 znaków",
    "some.weird.label.translation.key": "Dziwny tytuł",
    "some.weird.hint.translation.key": "Dziwny hint",
    "some.weird.placeholder.translation.key": "Dziwny placeholder"
  };

  Ember.I18n = { t: function(key) {
      return translations[key] || "missing-translation " + key;
  }, exists: function(key) {
    return !!translations[key];
  } };

  // We don't expect Ember.I18n to appear during runtime in real life
  component.notifyPropertyChange("label");
  component.notifyPropertyChange("hint");

  assert.equal(component.get("label"), "Title", "Label was humanized without translation key");
  assert.equal(component.get("hint"), null, "Hint was omitted without translation key");
  assert.equal(component.get("placeholder"), null, "Placeholder was omitted without translation key");

  model.constructor.modelName = "blog-post";
  // We don't expect model constructor changes in real life
  formBuilder.notifyPropertyChange("translationKey");

  assert.equal(component.get("label"), "Tytuł posta");
  assert.equal(component.get("hint"), "Maksymalnie 45 znaków");

  formBuilder.set("translationKey", "article");

  assert.equal(component.get("label"), "Tytuł artykułu");
  assert.equal(component.get("hint"), "Maksymalnie 255 znaków");
  assert.equal(component.get("placeholder"), "Wpisz tytuł");

  component.set("labelTranslation", "some.weird.label.translation.key");
  component.set("hintTranslation", "some.weird.hint.translation.key");
  component.set("placeholderTranslation", "some.weird.placeholder.translation.key");

  assert.equal(component.get("label"), "Dziwny tytuł");
  assert.equal(component.get("hint"), "Dziwny hint");
  assert.equal(component.get("placeholder"), "Dziwny placeholder");
});
