import Ember from "ember";
import { test, moduleForComponent } from "ember-qunit";
import FormBuilder from "ember-simple-form/models/form-builder";
import inputComponent from "ember-simple-form/helpers/input-component";

var attr = "category";
var formBuilder;
var model;

Ember.HTMLBars._registerHelper("input-component", inputComponent);

moduleForComponent("inputs/radio-buttons-input", "Radio Buttons Input component", {
  needs: ["component:inputs/radio-button-option",
          "template:components/inputs/radio-buttons-input",
          "template:components/inputs/radio-button-option"]
});

test("it renders collection of strings as radio buttons", function(assert) {
  var component = this.subject({
    collection: Ember.A(["Cooking", "Sports", "Politics"]),
    value: "Cooking"
  });

  Ember.run(function() {
    component.appendTo("#ember-testing");
  });

  assert.equal(component.$("input[type=radio][value=Cooking]+label").text().replace(/\s/, ""), "Cooking");
  assert.equal(component.$("input[type=radio][value=Sports]+label").text().replace(/\s/, ""), "Sports");
  assert.equal(component.$("input[type=radio][value=Politics]+label").text().replace(/\s/, ""), "Politics");
  assert.equal(component.$("input[type=radio][value=Cooking]").attr("value"), "Cooking");
  assert.equal(component.$("input[type=radio][value=Sports]").attr("value"), "Sports");
  assert.equal(component.$("input[type=radio][value=Politics]").attr("value"), "Politics");
});

test("it renders collection objects as inputs", function(assert) {
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

  assert.equal(component.$("input[type=radio][value=1]+label").text().replace(/\s$/, ""), "Cooking");
  assert.equal(component.$("input[type=radio][value=2]+label").text().replace(/\s$/, ""), "Sports");
  assert.equal(component.$("input[type=radio][value=3]+label").text().replace(/\s$/, ""), "Politics");
  assert.equal(component.$("input[type=radio][value=1]").attr("value"), "1");
  assert.equal(component.$("input[type=radio][value=2]").attr("value"), "2");
  assert.equal(component.$("input[type=radio][value=3]").attr("value"), "3");

  Ember.run(function() {
    component.set("optionLabelPath", "headline");
    component.set("optionValuePath", "slug");
  });

  assert.equal(component.$("input[type=radio][value=cooking]+label").text().replace(/\s$/, ""), "For kitchen geeks!");
  assert.equal(component.$("input[type=radio][value=sports]+label").text().replace(/\s$/, ""), "For couch potatos");
  assert.equal(component.$("input[type=radio][value=politics]+label").text().replace(/\s$/, ""), "For nerds");
  assert.equal(component.$("input[type=radio][value=cooking]").attr("value"), "cooking");
  assert.equal(component.$("input[type=radio][value=sports]").attr("value"), "sports");
  assert.equal(component.$("input[type=radio][value=politics]").attr("value"), "politics");
});

test("it selects given values", function(assert) {
  var component = this.subject({
    collection: Ember.A([{
      id: 1, name: "Cooking"
    }, {
      id: 2, name: "Sports"
    }, {
      id: 3, name: "Politics"
    }]),
    value: {
      id: 2, name: "Sports"
    }
  });

  Ember.run(function() {
    component.appendTo("#ember-testing");
  });

  assert.equal(component.$("input[type=radio]:checked").length, 1);
  assert.equal(component.$("input[type=radio]:checked").attr("value"), 2);

  Ember.run(function() {
    component.set("value", {
      id: 3, name: "Politics"
    });
  });

  assert.equal(component.$("input[type=radio]:checked").length, 1);
  assert.equal(component.$("input[type=radio]:checked").attr("value"), 3);
});

test("it updates value after changing", function(assert) {
  var component = this.subject({
    collection: Ember.A([{
      id: 1, name: "Cooking"
    }, {
      id: 2, name: "Sports"
    }, {
      id: 3, name: "Politics"
    }]),
    isMultiple: true,
    value: {
      id: 1, name: "Cooking"
    }
  });

  Ember.run(function() {
    component.appendTo("#ember-testing");
  });

  component.$("input").attr("checked", null);
  component.$("input[value=3]").attr("checked", "checked").trigger("change");

  assert.equal(component.get("value.id"), 3);
  assert.equal(component.get("value.name"), "Politics");
});
