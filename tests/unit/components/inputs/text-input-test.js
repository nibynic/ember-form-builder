import { test, moduleForComponent } from "ember-qunit";

moduleForComponent("inputs/text-input", "Text Input component", { unit: true });

test("it aliases modelValue as value", function(assert) {
  var component = this.subject({
    modelValue: "asdf"
  });

  assert.equal(component.get("value"), "asdf");
  component.set("modelValue", "zxc");
  assert.equal(component.get("value"),  "zxc");
});
