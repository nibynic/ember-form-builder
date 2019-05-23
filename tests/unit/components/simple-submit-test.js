import { run } from '@ember/runloop';
import EmberObject, {
  defineProperty,
  computed
} from '@ember/object';
import { module, test } from 'qunit';
import { setupTest } from "ember-qunit";
import FormBuilder from "ember-form-builder/models/form-builder";

var formBuilder;
var model;

module("Simple Submit component", function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    model = EmberObject.extend({}).create({ title: "Testing testing 123" });
    formBuilder = FormBuilder.create({
      object: model
    });
  });

  hooks.afterEach(function() {
    model = null;
    formBuilder = null;
  });

  test("it renders a submit button", function(assert) {
    var component = this.owner.factoryFor('component:simple-submit').create({
      builder: formBuilder
    });

    run(function() {
      component.appendTo("#ember-testing");
    });

    assert.dom(component.element).matchesSelector('button');
    assert.dom(component.element).hasAttribute('type', 'submit');
    assert.dom(component.element).hasText('Save');
  });

  test("it translates some attributes", function(assert) {
    model.constructor.modelName = null;
    var component = this.owner.factoryFor('component:simple-submit').create({
      builder: formBuilder
    });


    assert.equal(component.get("text"), "Save");

    var translations = {
      "article.actions.submit": "Zapisz artykuł",
      "post.actions.submit": "Zapisz post",
      "some.weird.submit.translation.key": "Zapisz dziw",
      "formBuilder.actions.submit": "Zapisz"
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
    var component = this.owner.factoryFor('component:simple-submit').create({
      builder: formBuilder
    });

    run(function() {
      component.appendTo("#ember-testing");
    });

    assert.equal(component.get("isDisabled"), false, "is not disabled");
    assert.dom(component.element).isNotDisabled("has no disabled attribute");

    run(function() {
      formBuilder.set("isLoading", true);
    });

    assert.equal(component.get("isDisabled"), true, "is disabled");
    assert.dom(component.element).isDisabled("has disabled attribute");
  });
});
