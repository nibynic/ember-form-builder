import { test, moduleForComponent } from "ember-qunit";

moduleForComponent("inputs/password-input", "Password Input component", { unit: true });

test("it aliases modelValue as value", function(assert) {
  var component = this.subject({
    modelValue: "asdf"
  });

  assert.equal(component.get("value"), "asdf");
  component.set("modelValue", "dupa.8");
  assert.equal(component.get("value"),  "dupa.8");
});
