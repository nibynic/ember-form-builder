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

  assert.equal(component.$("label:has(input[type=radio][value=Cooking])").text().replace(/\s/g, ""), "Cooking");
  assert.equal(component.$("label:has(input[type=radio][value=Sports])").text().replace(/\s/g, ""), "Sports");
  assert.equal(component.$("label:has(input[type=radio][value=Politics])").text().replace(/\s/g, ""), "Politics");
  assert.equal(component.$("input[type=radio][value=Cooking]").attr("value"), "Cooking");
  assert.equal(component.$("input[type=radio][value=Sports]").attr("value"), "Sports");
  assert.equal(component.$("input[type=radio][value=Politics]").attr("value"), "Politics");

  run(function() {
    component.set("modelValue", ["Cooking"]);
    component.set("isMultiple", true);
  });

  assert.equal(component.$("label:has(input[type=checkbox][value=Cooking])").text().replace(/\s/g, ""), "Cooking");
  assert.equal(component.$("label:has(input[type=checkbox][value=Sports])").text().replace(/\s/g, ""), "Sports");
  assert.equal(component.$("label:has(input[type=checkbox][value=Politics])").text().replace(/\s/g, ""), "Politics");
  assert.equal(component.$("input[type=checkbox][value=Cooking]").attr("value"), "Cooking");
  assert.equal(component.$("input[type=checkbox][value=Sports]").attr("value"), "Sports");
  assert.equal(component.$("input[type=checkbox][value=Politics]").attr("value"), "Politics");

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

  assert.equal(component.$("label:has(input[type=radio][value=1])").text().replace(/\s+$/, "").replace(/^\s+/, ""), "Cooking");
  assert.equal(component.$("label:has(input[type=radio][value=2])").text().replace(/\s+$/, "").replace(/^\s+/, ""), "Sports");
  assert.equal(component.$("label:has(input[type=radio][value=3])").text().replace(/\s+$/, "").replace(/^\s+/, ""), "Politics");
  assert.equal(component.$("input[type=radio][value=1]").attr("value"), "1");
  assert.equal(component.$("input[type=radio][value=2]").attr("value"), "2");
  assert.equal(component.$("input[type=radio][value=3]").attr("value"), "3");

  run(function() {
    component.set("optionLabelPath", "content.headline");
    component.set("optionStringValuePath", "value.slug");
  });

  assert.equal(component.$("label:has(input[type=radio][value=cooking])").text().replace(/\s+$/, "").replace(/^\s+/, ""), "For kitchen geeks!");
  assert.equal(component.$("label:has(input[type=radio][value=sports])").text().replace(/\s+$/, "").replace(/^\s+/, ""), "For couch potatos");
  assert.equal(component.$("label:has(input[type=radio][value=politics])").text().replace(/\s+$/, "").replace(/^\s+/, ""), "For nerds");
  assert.equal(component.$("input[type=radio][value=cooking]").attr("value"), "cooking");
  assert.equal(component.$("input[type=radio][value=sports]").attr("value"), "sports");
  assert.equal(component.$("input[type=radio][value=politics]").attr("value"), "politics");
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

  assert.equal(component.$("input[type=radio]:checked").length, 1);
  assert.ok(component.$("div:nth-child(2) input[type=radio]").is(":checked"));

  run(function() {
    component.set("modelValue", collection[2]);
  });

  assert.equal(component.$("input[type=radio]:checked").length, 1);
  assert.ok(component.$("div:nth-child(3) input[type=radio]").is(":checked"));

  run(function() {
    component.set("modelValue", A([collection[2]]));
    component.set("isMultiple", true);
  });

  assert.equal(component.$("input[type=checkbox]:checked").length, 1);
  assert.ok(component.$("div:nth-child(3) input[type=checkbox]").is(":checked"));

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

  component.$("input").prop("checked", false);
  component.$("input").eq(2).prop("checked", true).trigger("change");

  assert.equal(component.get("value.id"), 3);
  assert.equal(component.get("value.name"), "Politics");

  run(function() {
    component.set("modelValue", []);
    component.set("isMultiple", true);
  });

  component.$("input").prop("checked", false);
  component.$("input").eq(0).prop("checked", true).trigger("change");
  component.$("input").eq(2).prop("checked", true).trigger("change");

  assert.equal(component.get("value.firstObject.id"), 1);
  assert.equal(component.get("value.firstObject.name"), "Cooking");
  assert.equal(component.get("value.lastObject.id"), 3);
  assert.equal(component.get("value.lastObject.name"), "Politics");

  component.$("div:nth-child(1) input").prop("checked", false).trigger("change");

  assert.equal(component.get("value.firstObject.id"), 3);
  assert.equal(component.get("value.firstObject.name"), "Politics");
});
