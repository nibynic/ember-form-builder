import { run } from '@ember/runloop';
import { A } from '@ember/array';
import { test, moduleForComponent } from "ember-qunit";

moduleForComponent("inputs/collection-input", "Collection Input component", {
  needs: ["component:inputs/select-option", "template:components/inputs/select-option"],
  unit: true
});

test("it renders collection of strings as options", function(assert) {
  var component = this.subject({
    collection: ["Cooking", "Sports", "Politics"],
    modelValue: "Cooking"
  });

  run(function() {
    component.appendTo("#ember-testing");
  });

  assert.equal(component.$("option:nth-child(1)").text().replace(/\s/, ""), "Cooking");
  assert.equal(component.$("option:nth-child(2)").text().replace(/\s/, ""), "Sports");
  assert.equal(component.$("option:nth-child(3)").text().replace(/\s/, ""), "Politics");
  assert.equal(component.$("option:nth-child(1)").attr("value"), "Cooking");
  assert.equal(component.$("option:nth-child(2)").attr("value"), "Sports");
  assert.equal(component.$("option:nth-child(3)").attr("value"), "Politics");
});

test("it renders collection objects as options", function(assert) {
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

  assert.equal(component.$("option:nth-child(1)").text().replace(/\s$/, ""), "Cooking");
  assert.equal(component.$("option:nth-child(2)").text().replace(/\s$/, ""), "Sports");
  assert.equal(component.$("option:nth-child(3)").text().replace(/\s$/, ""), "Politics");
  assert.equal(component.$("option:nth-child(1)").attr("value"), "1");
  assert.equal(component.$("option:nth-child(2)").attr("value"), "2");
  assert.equal(component.$("option:nth-child(3)").attr("value"), "3");

  run(function() {
    component.set("optionLabelPath", "content.headline");
    component.set("optionValuePath", "content.slug");
  });

  assert.equal(component.$("option:nth-child(1)").text().replace(/\s$/, ""), "For kitchen geeks!");
  assert.equal(component.$("option:nth-child(2)").text().replace(/\s$/, ""), "For couch potatos");
  assert.equal(component.$("option:nth-child(3)").text().replace(/\s$/, ""), "For nerds");
  assert.equal(component.$("option:nth-child(1)").attr("value"), "cooking");
  assert.equal(component.$("option:nth-child(2)").attr("value"), "sports");
  assert.equal(component.$("option:nth-child(3)").attr("value"), "politics");
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
    modelValue: collection[0],
    optionValuePath: "content",
    optionStringValuePath: 'value.name'
  });

  run(function() {
    component.appendTo("#ember-testing");
  });

  assert.equal(component.$("option:selected").length, 1);
  assert.ok(component.$("option[value=Cooking]").is(":selected"), "1");

  run(function() {
    component.set("isMultiple", true);
    component.set("modelValue", [collection[1], collection[2]]);
  });

  assert.equal(component.$("option:selected").length, 2);
  assert.ok(component.$("option[value=Sports]").is(":selected"), "2");
  assert.ok(component.$("option[value=Politics]").is(":selected"), "3");

  run(function() {
    component.set("optionValuePath", "content.id");
    component.set("optionStringValuePath", "value");
    component.set("modelValue", A([2]));
  });

  assert.equal(component.$("option:selected").length, 1, 123);
  assert.equal(component.$("option:selected").attr("value"), "2");

  run(function() {
    component.get("modelValue").pushObject(1);
  });

  assert.equal(component.$("option:selected").length, 2, 123);
  assert.ok(component.$("option[value=1]").is(":selected"), "1");
  assert.ok(component.$("option[value=2]").is(":selected"), "2");
});

test("it updates value after changing", function(assert) {
  var collection = [{
    id: 1, name: "Cooking"
  }, {
    id: 2, name: "Sports"
  }, {
    id: 3, name: "Politics"
  }];
  var component = this.subject({
    collection: collection,
    isMultiple: true,
    modelValue: [collection[0], collection[1]],
    optionValuePath: "content"
  });

  run(function() {
    component.appendTo("#ember-testing");
  });

  component.$("option").prop("selected", false);
  component.$("option:nth-child(3)").prop("selected", "selected");
  component.$().trigger("change");

  assert.equal(component.get("value.length"), 1);
  assert.equal(component.get("value.firstObject.id"), 3);
  assert.equal(component.get("value.firstObject.name"), "Politics");

  run(function() {
    component.set("optionValuePath", "content.id");
    component.set('optionStringValuePath', 'value');
  });

  component.$("option").prop("selected", false);
  component.$("option[value=3]").prop("selected", "selected");
  component.$().trigger("change");

  assert.equal(component.get("value.length"), 1);
  assert.equal(component.get("value.firstObject"), 3);
});

test("it sets the value after being displayed", function(assert) {
  var component = this.subject({
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
  var component = this.subject({
    modelValue: null
  });

  assert.equal(component.get('isMultiple'), false);

  component.set('modelValue', []);

  assert.equal(component.get('isMultiple'), true);
});
