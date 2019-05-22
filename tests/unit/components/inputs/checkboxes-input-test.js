import { run } from '@ember/runloop';
import { A } from '@ember/array';
import { test, moduleForComponent } from "ember-qunit";

moduleForComponent("inputs/checkboxes-input", "Checkboxes Input component", {
  needs: ["component:inputs/checkbox-option",
          "template:components/inputs/checkboxes-input",
          "template:components/inputs/checkbox-option"],
  unit: true
});

test("it renders collection of strings as radio buttons or checkboxes", function(assert) {
  var component = this.subject({
    collection: ["Cooking", "Sports", "Politics"],
    modelValue: "Cooking"
  });

  run(function() {
    component.appendTo("#ember-testing");
  });

  let options = component.element.querySelectorAll('label');

  assert.dom(options[0]).hasText('Cooking');
  assert.dom(options[1]).hasText('Sports');
  assert.dom(options[2]).hasText('Politics');
  assert.dom(options[0].querySelector('input')).hasAttribute('value', 'Cooking');
  assert.dom(options[1].querySelector('input')).hasAttribute('value', 'Sports');
  assert.dom(options[2].querySelector('input')).hasAttribute('value', 'Politics');

  run(function() {
    component.set("modelValue", ["Cooking"]);
    component.set("isMultiple", true);
  });

  options = component.element.querySelectorAll('label');

  assert.dom(options[0]).hasText('Cooking');
  assert.dom(options[1]).hasText('Sports');
  assert.dom(options[2]).hasText('Politics');
  assert.dom(options[0].querySelector('input')).hasAttribute('value', 'Cooking');
  assert.dom(options[1].querySelector('input')).hasAttribute('value', 'Sports');
  assert.dom(options[2].querySelector('input')).hasAttribute('value', 'Politics');

});

test("it renders collection objects as inputs", function(assert) {
  var component = this.subject({
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

  let options = component.element.querySelectorAll('label');

  assert.dom(options[0]).hasText('Cooking');
  assert.dom(options[1]).hasText('Sports');
  assert.dom(options[2]).hasText('Politics');
  assert.dom(options[0].querySelector('input')).hasAttribute('value', '1');
  assert.dom(options[1].querySelector('input')).hasAttribute('value', '2');
  assert.dom(options[2].querySelector('input')).hasAttribute('value', '3');

  run(function() {
    component.set("optionLabelPath", "content.headline");
    component.set("optionStringValuePath", "value.slug");
  });

  options = component.element.querySelectorAll('label');

  assert.dom(options[0]).hasText('For kitchen geeks!');
  assert.dom(options[1]).hasText('For couch potatos');
  assert.dom(options[2]).hasText('For nerds');
  assert.dom(options[0].querySelector('input')).hasAttribute('value', 'cooking');
  assert.dom(options[1].querySelector('input')).hasAttribute('value', 'sports');
  assert.dom(options[2].querySelector('input')).hasAttribute('value', 'politics');
});

test("it selects given values", function(assert) {
  var collection = [{
    id: 1, name: "Cooking"
  }, {
    id: 2, name: "Sports"
  }, {
    id: 3, name: "Politics"
  }];
  var component = this.subject({
    collection: collection,
    modelValue: collection[1],
    optionValuePath: "content"
  });

  run(function() {
    component.appendTo("#ember-testing");
  });

  assert.dom('input[type=radio]:checked').exists({ count: 1 });
  assert.dom('input[type=radio][value="2"]').isChecked();

  run(function() {
    component.set("modelValue", collection[2]);
  });

  assert.dom('input[type=radio]:checked').exists({ count: 1 });
  assert.dom('input[type=radio][value="3"]').isChecked();

  run(function() {
    component.set("modelValue", A([collection[2]]));
    component.set("isMultiple", true);
  });

  assert.dom('input[type=checkbox]:checked').exists({ count: 1 });
  assert.dom('input[type=checkbox][value="3"]').isChecked();

});

test("it updates value after changing", function(assert) {
  var component = this.subject({
    collection: [{
      id: 1, name: "Cooking"
    }, {
      id: 2, name: "Sports"
    }, {
      id: 3, name: "Politics"
    }],
    modelValue: {
      id: 1, name: "Cooking"
    },
    optionValuePath: "content"
  });

  run(function() {
    component.appendTo("#ember-testing");
  });

  component.element.querySelector('input[value="1"]').checked = false;
  component.element.querySelector('input[value="3"]').checked = true;
  component.element.querySelector('input[value="3"]').dispatchEvent(new Event('change', { bubbles: true }));

  assert.equal(component.get("value.id"), 3);
  assert.equal(component.get("value.name"), "Politics");

  run(function() {
    component.set("modelValue", []);
    component.set("isMultiple", true);
  });

  component.element.querySelector('input[value="1"]').checked = true;
  component.element.querySelector('input[value="3"]').checked = true;
  component.element.querySelector('input[value="3"]').dispatchEvent(new Event('change', { bubbles: true }));

  assert.equal(component.get("value.firstObject.id"), 1);
  assert.equal(component.get("value.firstObject.name"), "Cooking");
  assert.equal(component.get("value.lastObject.id"), 3);
  assert.equal(component.get("value.lastObject.name"), "Politics");

  component.element.querySelector('input[value="1"]').checked = false;
  component.element.querySelector('input[value="1"]').dispatchEvent(new Event('change', { bubbles: true }));

  assert.equal(component.get("value.firstObject.id"), 3);
  assert.equal(component.get("value.firstObject.name"), "Politics");
});
