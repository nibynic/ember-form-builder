import { test, moduleForComponent } from "ember-qunit";

moduleForComponent("inputs/number-input", "Number Input component");

test("it aliases modelValue as value", function(assert) {
  var component = this.subject({
    modelValue: 113
  });

  assert.equal(component.get("value"), 113);
  component.set("modelValue", 312);
  assert.equal(component.get("value"),  312);
});

test("it uses numericality validations", function(assert) {
  var component = this.subject({
    modelValue: 113,
    validations: {
      numericality: {greaterThan: 5, lessThan: 120}
    }
  });

  assert.equal(component.get("min"), 4.99);
  assert.equal(component.get("max"), 120.01);
  assert.equal(component.get("step"), 0.01);

  component.set("validations", {
    numericality: {greaterThanOrEqualTo: 5, lessThanOrEqualTo: 120, onlyInteger: true}
  });

  assert.equal(component.get("min"), 5);
  assert.equal(component.get("max"), 120);
  assert.equal(component.get("step"), 1);
});
