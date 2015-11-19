import { test, moduleForComponent } from "ember-qunit";

moduleForComponent("inputs/tel-input", "Tel Input component");

test("it aliases modelValue as value", function(assert) {
  var component = this.subject({
    modelValue: "0700606060"
  });

  assert.equal(component.get("value"), "0700606060");
  component.set("modelValue", "0800801801");
  assert.equal(component.get("value"),  "0800801801");
});
