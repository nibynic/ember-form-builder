import { module, test } from 'qunit';
import { setupTest } from "ember-qunit";

module("Email Input component", function(hooks) {
  setupTest(hooks);

  test("it aliases modelValue as value", function(assert) {
    var component = this.owner.factoryFor('component:inputs/email-input').create({
      modelValue: "jan.testowy@example.com"
    });

    assert.equal(component.get("value"), "jan.testowy@example.com");
    component.set("modelValue", "janina.kaszanina@example.com");
    assert.equal(component.get("value"),  "janina.kaszanina@example.com");
  });
});
