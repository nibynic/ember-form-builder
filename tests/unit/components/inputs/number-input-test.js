import { test, moduleForComponent } from "ember-qunit";

moduleForComponent("inputs/number-input", "Number Input component", { unit: true });

test("it aliases modelValue as value", function(assert) {
  var component = this.subject({
    modelValue: 113
  });

  assert.equal(component.get("value"), 113);
  component.set("modelValue", 312);
  assert.equal(component.get("value"),  312);

  component.set('value', '333');
  assert.strictEqual(component.get('modelValue'), 333, 'should normalize values to integer');

  component.set('value', '');
  assert.strictEqual(component.get('modelValue'), undefined, 'empty values should become undefined');
});

test("it uses numericality validations", function(assert) {
  var component = this.subject({
    modelValue: 113,
    validations: {
      number: {gt: 5, lt: 120}
    }
  });

  assert.equal(component.get("min"), 5.01);
  assert.equal(component.get("max"), 119.99);
  assert.equal(component.get("step"), 0.01);

  component.set("validations", {
    number: {gte: 5, lte: 120, integer: true}
  });

  assert.equal(component.get("min"), 5);
  assert.equal(component.get("max"), 120);
  assert.equal(component.get("step"), 1);
});
