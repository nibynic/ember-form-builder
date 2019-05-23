import { run } from '@ember/runloop';
import { A } from '@ember/array';
import { module, test } from 'qunit';
import { setupTest } from "ember-qunit";

module("Collection Input component", function(hooks) {
  setupTest(hooks);

  test("it renders collection of strings as options", function(assert) {
    var component = this.owner.factoryFor('component:inputs/collection-input').create({
      collection: ["Cooking", "Sports", "Politics"],
      modelValue: "Cooking"
    });

    run(function() {
      component.appendTo("#ember-testing");
    });

    let options = component.element.querySelectorAll('option');

    assert.dom(options[0]).hasText('Cooking');
    assert.dom(options[1]).hasText('Sports');
    assert.dom(options[2]).hasText('Politics');
    assert.dom(options[0]).hasAttribute('value', 'Cooking');
    assert.dom(options[1]).hasAttribute('value', 'Sports');
    assert.dom(options[2]).hasAttribute('value', 'Politics');
  });

  test("it renders collection objects as options", function(assert) {
    var component = this.owner.factoryFor('component:inputs/collection-input').create({
      collection: [{
        id: 1, name: "Cooking", slug: "cooking", headline: "For kitchen geeks!"
      }, {
        id: 2, name: "Sports", slug: "sports", headline: "For couch potatos"
      }, {
        id: 3, name: "Politics", slug: "politics", headline: "For nerds"
      }],
      modelValue: {
        id: 2, name: "Sports", slug: "sports", headline: "For couch potatos"
      }
    });

    run(function() {
      component.appendTo("#ember-testing");
    });

    let options = component.element.querySelectorAll('option');

    assert.dom(options[0]).hasText('Cooking');
    assert.dom(options[1]).hasText('Sports');
    assert.dom(options[2]).hasText('Politics');
    assert.dom(options[0]).hasAttribute('value', '1');
    assert.dom(options[1]).hasAttribute('value', '2');
    assert.dom(options[2]).hasAttribute('value', '3');

    run(function() {
      component.set("optionLabelPath", "content.headline");
      component.set("optionValuePath", "content.slug");
    });

    options = component.element.querySelectorAll('option');

    assert.dom(options[0]).hasText('For kitchen geeks!');
    assert.dom(options[1]).hasText('For couch potatos');
    assert.dom(options[2]).hasText('For nerds');
    assert.dom(options[0]).hasAttribute('value', 'cooking');
    assert.dom(options[1]).hasAttribute('value', 'sports');
    assert.dom(options[2]).hasAttribute('value', 'politics');
  });

  test("it selects given values", function(assert) {
    var collection = [{
      id: 1, name: "Cooking"
    }, {
      id: 2, name: "Sports"
    }, {
      id: 3, name: "Politics"
    }];
    var component = this.owner.factoryFor('component:inputs/collection-input').create({
      collection: collection,
      modelValue: collection[0],
      optionValuePath: "content",
      optionStringValuePath: 'value.name'
    });

    run(function() {
      component.appendTo("#ember-testing");
    });

    assert.dom('option:checked').exists({ count: 1 });
    assert.dom('option[value=Cooking]').matchesSelector(':checked');

    run(function() {
      component.set("isMultiple", true);
      component.set("modelValue", [collection[1], collection[2]]);
    });

    assert.dom('option:checked').exists({ count: 2 });
    assert.dom('option[value=Sports]').matchesSelector(':checked');
    assert.dom('option[value=Politics]').matchesSelector(':checked');

    run(function() {
      component.set("optionValuePath", "content.id");
      component.set("optionStringValuePath", "value");
      component.set("modelValue", A([2]));
    });

    assert.dom('option:checked').exists({ count: 1 });
    assert.dom('option[value="2"]').matchesSelector(':checked');

    run(function() {
      component.get("modelValue").pushObject(1);
    });

    assert.dom('option:checked').exists({ count: 2 });
    assert.dom('option[value="1"]').matchesSelector(':checked');
    assert.dom('option[value="2"]').matchesSelector(':checked');
  });

  test("it updates value after changing", function(assert) {
    var collection = [{
      id: 1, name: "Cooking"
    }, {
      id: 2, name: "Sports"
    }, {
      id: 3, name: "Politics"
    }];
    var component = this.owner.factoryFor('component:inputs/collection-input').create({
      collection: collection,
      isMultiple: true,
      modelValue: [collection[0], collection[1]],
      optionValuePath: "content"
    });

    run(function() {
      component.appendTo("#ember-testing");
    });

    component.element.querySelector('option[value="1"]').selected = false;
    component.element.querySelector('option[value="2"]').selected = false;
    component.element.querySelector('option[value="3"]').selected = true;
    component.element.dispatchEvent(new Event('change', { bubbles: true }));

    assert.equal(component.get("value.length"), 1);
    assert.equal(component.get("value.firstObject.id"), 3);
    assert.equal(component.get("value.firstObject.name"), "Politics");

    run(function() {
      component.set("optionValuePath", "content.id");
      component.set('optionStringValuePath', 'value');
    });

    component.element.querySelector('option[value="3"]').selected = false;
    component.element.querySelector('option[value="2"]').selected = true;
    component.element.dispatchEvent(new Event('change', { bubbles: true }));

    assert.equal(component.get("value.length"), 1);
    assert.equal(component.get("value.firstObject"), 2);
  });

  test("it sets the value after being displayed", function(assert) {
    var component = this.owner.factoryFor('component:inputs/collection-input').create({
      collection: ["Cooking", "Sports", "Politics"],
      modelValue: null
    });

    assert.equal(component.get("value"), null);

    run(function() {
      component.appendTo("#ember-testing");
    });

    assert.equal(component.get("value"), "Cooking");
  });

  test("it detects multiple mode", function(assert) {
    var component = this.owner.factoryFor('component:inputs/collection-input').create({
      modelValue: null
    });

    assert.equal(component.get('isMultiple'), false);

    component.set('modelValue', []);

    assert.equal(component.get('isMultiple'), true);
  });
});
