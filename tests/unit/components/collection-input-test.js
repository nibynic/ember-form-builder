import Ember from "ember";
import { test, moduleForComponent } from "ember-qunit";
import FormBuilder from "ember-simple-form/models/form-builder";
import inputComponent from "ember-simple-form/helpers/input-component";

var attr = "category";
var formBuilder;
var model;

Ember.HTMLBars._registerHelper("input-component", inputComponent);

moduleForComponent("inputs/collection-input", "Collection Input component", {
  needs: ["component:inputs/select-option", "template:components/inputs/select-option"]
});

test("it renders collection of strings as options", function(assert) {
  var component = this.subject({
    collection: Ember.A(["Cooking", "Sports", "Politics"]),
    value: "Cooking"
  });

  Ember.run(function() {
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
    collection: Ember.A([{
      id: 1, name: "Cooking", slug: "cooking", headline: "For kitchen geeks!"
    }, {
      id: 2, name: "Sports", slug: "sports", headline: "For couch potatos"
    }, {
      id: 3, name: "Politics", slug: "politics", headline: "For nerds"
    }]),
    value: {
      id: 2, name: "Sports", slug: "sports", headline: "For couch potatos"
    }
  });

  Ember.run(function() {
    component.appendTo("#ember-testing");
  });

  assert.equal(component.$("option:nth-child(1)").text().replace(/\s$/, ""), "Cooking");
  assert.equal(component.$("option:nth-child(2)").text().replace(/\s$/, ""), "Sports");
  assert.equal(component.$("option:nth-child(3)").text().replace(/\s$/, ""), "Politics");
  assert.equal(component.$("option:nth-child(1)").attr("value"), "1");
  assert.equal(component.$("option:nth-child(2)").attr("value"), "2");
  assert.equal(component.$("option:nth-child(3)").attr("value"), "3");

  Ember.run(function() {
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
  var collection = Ember.A([{
    id: 1, name: "Cooking"
  }, {
    id: 2, name: "Sports"
  }, {
    id: 3, name: "Politics"
  }]);
  var component = this.subject({
    collection: collection,
    value: collection[1],
    optionValuePath: "content"
  });

  Ember.run(function() {
    component.appendTo("#ember-testing");
  });

  assert.equal(component.$("option:selected").length, 1, 123123);
  assert.ok(component.$("option:nth-child(2)").is(":selected"), "1");

  Ember.run(function() {
    component.set("isMultiple", true);
    component.set("value", Ember.A([collection[1], collection[2]]));
  });

  assert.equal(component.$("option:selected").length, 2, 234);
  assert.ok(component.$("option:nth-child(2)").is(":selected"), "2");
  assert.ok(component.$("option:nth-child(3)").is(":selected"), "3");

  Ember.run(function() {
    component.set("optionValuePath", "content.id");
    component.set("value", Ember.A([2]));
  });
  
  assert.equal(component.$("option:selected").length, 1, 123);
  assert.equal(component.$("option:selected").attr("value"), 2);
});

test("it updates value after changing", function(assert) {
  var collection = Ember.A([{
    id: 1, name: "Cooking"
  }, {
    id: 2, name: "Sports"
  }, {
    id: 3, name: "Politics"
  }]);
  var component = this.subject({
    collection: collection,
    isMultiple: true,
    value: Ember.A([collection[0], collection[1]]),
    optionValuePath: "content"
  });

  Ember.run(function() {
    component.appendTo("#ember-testing");
  });

  component.$("option").attr("selected", null);
  component.$("option:nth-child(3)").attr("selected", "selected");
  component.$().trigger("change");

  assert.equal(component.get("value.length"), 1);
  assert.equal(component.get("value.firstObject.id"), 3);
  assert.equal(component.get("value.firstObject.name"), "Politics");

  Ember.run(function() {
    component.set("optionValuePath", "content.id");
  });

  component.$("option").attr("selected", null);
  component.$("option[value=3]").attr("selected", "selected");
  component.$().trigger("change");

  assert.equal(component.get("value.length"), 1);
  assert.equal(component.get("value.firstObject"), 3);
});

test("it sets the value after being displayed", function(assert) {
  var component = this.subject({
    collection: Ember.A(["Cooking", "Sports", "Politics"]),
    value: null
  });

  assert.equal(component.get("value"), null);

  Ember.run(function() {
    component.appendTo("#ember-testing");
  });

  assert.equal(component.get("value"), "Cooking");
});
