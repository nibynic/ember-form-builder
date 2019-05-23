import { A } from '@ember/array';
import { run } from '@ember/runloop';
import EmberObject, {
  defineProperty,
  computed
} from '@ember/object';
import { module, test } from 'qunit';
import { setupTest } from "ember-qunit";
import FormBuilder from "ember-form-builder/models/form-builder";
import configurationInitialiser from "../../../initializers/ember-form-builder-configuration";

var type = "string";
var defaultTypes = ["string", "text", "boolean",
  "number", "date", "password", "email", "tel"];
var attr = "title";
var formBuilder;
var model;

configurationInitialiser.initialize();

var dependencies = defaultTypes.map(function(t) {
  return "component:inputs/" + t + "-input";
});
dependencies.push("component:simple-label");
dependencies.push("template:components/simple-label");
dependencies.push("component:inputs/collection-input");
dependencies.push("template:components/inputs/collection-input");
dependencies.push("component:inputs/select-option");
dependencies.push("template:components/inputs/select-option");
dependencies.push("service:formBuilderTranslations");

module("Simple Input component", function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    model = EmberObject.extend({}).create({ title: "Testing testing 123" });
    formBuilder = FormBuilder.create({
      object: model,
      errorsPathFor(attr) {
        return `object.errorsMock.${attr}`;
      }
    });
  });

  hooks.afterEach(function() {
    model = null;
    formBuilder = null;
  });

  test("it reflects value updates", function(assert) {
    var component = this.owner.factoryFor('component:simple-input').create({
      builder: formBuilder,
      as: type,
      attr: attr
    });

    run(function() {
      component.appendTo("#ember-testing");
    });

    assert.dom('input').hasValue("Testing testing 123");

    run(function() {
      model.set("title", "Another test!");
    });

    assert.dom('input').hasValue("Another test!");
  });

  test("it proxies auxiliary attributes", function(assert) {
    var component = this.owner.factoryFor('component:simple-input').create({
      builder: formBuilder,
      as: "collection",
      collection: A(["a", "b", "c"]),
      additionalAttributeNames: A(["collection"]),
      attr: attr
    });

    run(function() {
      component.appendTo("#ember-testing");
    });

    assert.dom('option').exists({ count: 3 }, "Initial options are correctly displayed");

    run(function() {
      component.get("collection").pushObject("d");
    });

    assert.dom('option').exists({ count: 4 }, "Updated options are correctly displayed");

    run(function() {
      component.set("collection", A(["e"]));
    });

    assert.dom('option').exists({ count: 1 }, "Replaced options are correctly displayed");
  });

  test("it renders input name and class", function(assert) {
    formBuilder.set('name', 'article');
    formBuilder.set('modelName', 'blogPost');
    var component = this.owner.factoryFor('component:simple-input').create({
      builder: formBuilder,
      as: type,
      attr: 'postTitle'
    });

    run(function() {
      component.appendTo("#ember-testing");
    });

    assert.dom('input').hasAttribute('name', 'article[postTitle]');
    assert.dom(component.element).hasClass('post-title-attr-input', 'should set post-title-attr-input class for .input element');
    assert.dom(component.element).hasClass('post-title-attr-input', 'should set blog-post-model-input class for .input element');
  });

  test("it uses the classes from configuration", function(assert) {
    var component = this.owner.factoryFor('component:simple-input').create({
      builder: formBuilder,
      as: type,
      attr: attr,
      fieldClass: 'additional-class'
    });

    run(function() {
      component.appendTo("#ember-testing");
    });

    assert.dom(component.element).hasClass('input', "Wrapper element has the configured wrapper class.");
    assert.dom(component.element).hasClass('string-input', "Wrapper element has a type-based class.");
    assert.dom('.field').exists({ count: 1}, "Field element has the configured class.");
    assert.dom('.field.additional-class').exists({ count: 1}, "Additional classes can be passed.");
    assert.dom('input').hasClass('input-control', "Wrapper element has a type-based class.");
  });

  test("it reflects error updates", function(assert) {
    var component = this.owner.factoryFor('component:simple-input').create({
      builder: formBuilder,
      as: type,
      attr: attr
    });

    run(function() {
      component.appendTo("#ember-testing");
    });

    assert.ok(!component.get("hasErrors"), "Component has no errors.");
    assert.dom(component.element).doesNotHaveClass('input-with-errors', "Wrapper element has no error class assigned.");
    assert.dom('.errors').doesNotExist();
    assert.dom('input').hasValue("Testing testing 123");

    run(function() {
      model.set("errorsMock", {
        title: ["can't be blank", "is too short"]
      });
    });

    assert.ok(!component.get("hasErrors"), "Component has no errors if wasn't focused out.");
    assert.dom(component.element).doesNotHaveClass('input-with-errors', "Wrapper element has no error class assigned if wasn't focused out.");
    assert.dom('.errors').doesNotExist("No errors are displayed if wasn't focused out");

    run(function() {
      formBuilder.set("isValid", false);
    });

    assert.ok(component.get("hasErrors"), "Component has errors when builder is invalid.");
    assert.dom(component.element).hasClass('input-with-errors', "Wrapper element has an error class assigned when builder is invalid.");
    assert.dom('.errors').hasText("can't be blank, is too short", "The errors are displayed when builder is invalid");

    run(function() {
      formBuilder.set("isValid", true);
    });

    assert.ok(!component.get("hasErrors"), "Just to be sure it stopped displaying errors.");

    run(function() {
      component.focusOut();
    });

    assert.ok(component.get("hasErrors"), "Component has errors.");
    assert.dom(component.element).hasClass('input-with-errors', "Wrapper element has an error class assigned.");
    assert.dom('.errors').hasText("can't be blank, is too short", "The errors are displayed");
  });

  test("it renders a hint when provided", function(assert) {
    var component = this.owner.factoryFor('component:simple-input').create({
      builder: formBuilder,
      as: type,
      attr: attr
    });

    run(function() {
      component.appendTo("#ember-testing");
    });

    assert.ok(!component.get("hasHint"));
    assert.dom('.hint').doesNotExist();

    run(function() {
      component.set("hint", "This is a hint");
    });

    assert.ok(component.get("hasHint"));
    assert.dom('.hint').hasText("This is a hint");
  });

  test("it renders a placeholder when provided", function(assert) {
    var component = this.owner.factoryFor('component:simple-input').create({
      builder: formBuilder,
      as: type,
      attr: attr
    });

    run(function() {
      component.appendTo("#ember-testing");
    });

    assert.dom('input').doesNotHaveAttribute('placeholder');

    run(function() {
      component.set("placeholder", "This is a placeholder");
    });

    assert.dom('input').hasAttribute('placeholder', "This is a placeholder");
  });

  test("it humanizes the property for use as label", function(assert) {
    var component = this.owner.factoryFor('component:simple-input').create({
      builder: formBuilder,
      as: type,
      attr: "multiWordAttribute"
    });

    run(function() {
      component.appendTo("#ember-testing");
    });

    assert.equal(component.get("label"), "Multi word attribute");
    assert.dom('label').hasText('Multi word attribute', "The humanized label test is rendered");
  });

  test("it uses the provided label if it's provided", function(assert) {
    var component = this.owner.factoryFor('component:simple-input').create({
      builder: formBuilder,
      as: type,
      attr: attr,
      label: "Custom title"
    });

    run(function() {
      component.appendTo("#ember-testing");
    });

    assert.equal(component.get("label"), "Custom title");
    assert.dom('label').hasText('Custom title', "The custom label test is rendered");
  });

  test("it renders assigns the input's id as the label's for", function(assert) {
    var component = this.owner.factoryFor('component:simple-input').create({
      builder: formBuilder,
      as: type,
      attr: attr
    });

    run(function() {
      component.appendTo("#ember-testing");
    });

    assert.dom('label').hasAttribute('for', component.element.querySelector('input').id);
  });

  test("it renders the label differently when it's inline", function(assert) {
    var component = this.owner.factoryFor('component:simple-input').create({
      builder: formBuilder,
      as: type,
      attr: attr
    });

    run(function() {
      component.appendTo("#ember-testing");
    });

    assert.dom('.simple-input-label+.field').exists({ count: 1 }, "The label is rendered before the field");

    run(function() {
      component.set("inlineLabel", true);
    });

    assert.dom('label>input').exists({ count: 1 }, "The label contains the input");
    assert.dom(component.element).hasClass('inline-label', 'The component gets inline-label class');
  });

  test("it renders no label when it's set to false", function(assert) {
    var component = this.owner.factoryFor('component:simple-input').create({
      builder: formBuilder,
      as: type,
      attr: attr,
      label: false
    });

    run(function() {
      component.appendTo("#ember-testing");
    });

    assert.dom('label').doesNotExist("There is no label in regular layout");

    run(function() {
      component.set("inlineLabel", true);
    });

    assert.dom('label').doesNotExist("There is no label in inline layout");
  });

  test("it renders the required mark", function(assert) {
    model.set("validations", { "name": { "presence": {} } });
    var component = this.owner.factoryFor('component:simple-input').create({
      builder: formBuilder,
      as: type,
      attr: "name"
    });

    run(function() {
      component.appendTo("#ember-testing");
    });

    assert.ok(component.get("isRequired"), "Is required");
    assert.dom('label abbr').hasText('*');
    assert.dom('label abbr').hasAttribute('title', "Required");
  });

  test("it renders unit when it's provided", function(assert) {
    var component = this.owner.factoryFor('component:simple-input').create({
      builder: formBuilder,
      as: type,
      attr: "name"
    });

    run(function() {
      component.appendTo("#ember-testing");
    });

    assert.ok(!component.get("hasUnit"), "Has no unit");
    assert.dom(component.element).doesNotHaveClass('has-unit', "Has no has-unit class");
    assert.dom('.input-unit').doesNotExist("Unit was not rendered");

    run(function() {
      component.set("unit", "PLN");
    });

    assert.ok(component.get("hasUnit"), "Has unit");
    assert.dom(component.element).hasClass('has-unit', "Has has-unit class");
    assert.dom('.input-unit').hasText("PLN");
  });

  defaultTypes.forEach(function(type) {
    test("it renders correctly for type \"" + type + "\"", function(assert) {
      var component = this.subject({
        builder: formBuilder,
        as: type,
        attr: attr
      });

      run(function() {
        component.appendTo("#ember-testing");
      });

      assert.dom(`#${component.get("inputElementId")}`).exists({ count: 1 }, "Rendered correctly for type \"" + type + "\"");
    });
  });

  test("it passes all external attributes to the input component", function(assert) {
    var component = this.owner.factoryFor('component:simple-input').create({
      builder: formBuilder,
      as: type,
      attr: attr,
      customAttr1: "asdf",
      collection: ["a", "b", "c"],
      inputAttributeNames: ["customAttr1", "collection"]
    });

    run(function() {
      component.appendTo("#ember-testing");
    });

    assert.ok(component.get("inputAttributeNames").indexOf("customAttr1") > -1);
    assert.ok(component.get("inputAttributeNames").indexOf("collection") > -1);
  });

  test("it translates some attributes", function(assert) {
    model.constructor.modelName = null;
    var component = this.owner.factoryFor('component:simple-input').create({
      builder: formBuilder,
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

    defineProperty(component, "translationService", computed(function() {
      return {
        t(key) {
          return translations[key] || "missing-translation " + key;
        },
        exists(key) {
          return !!translations[key];
        }
      };
    }));

    // We don't expect i18n to appear during runtime in real life
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
});
