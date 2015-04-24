import Ember from "ember";
import { test, moduleForComponent } from "ember-qunit";

moduleForComponent("inputs/boolean-input", "Boolean Input component");

test("it aliases modelValue as value and checked", function(assert) {
  var component = this.subject({
    modelValue: true
  });

  assert.equal(component.get("value"), true);
  assert.equal(component.get("checked"), true);
  component.set("modelValue", false);
  assert.equal(component.get("value"), false);
  assert.equal(component.get("checked"), false);
});
