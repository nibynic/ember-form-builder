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
