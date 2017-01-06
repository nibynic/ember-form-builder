import { test, moduleForComponent } from "ember-qunit";

moduleForComponent("inputs/email-input", "Email Input component", { unit: true });

test("it aliases modelValue as value", function(assert) {
  var component = this.subject({
    modelValue: "jan.testowy@example.com"
  });

  assert.equal(component.get("value"), "jan.testowy@example.com");
  component.set("modelValue", "janina.kaszanina@example.com");
  assert.equal(component.get("value"),  "janina.kaszanina@example.com");
});
