import { module, test } from 'qunit';
import { setupTest } from "ember-qunit";

module("Password Input component", function(hooks) {
  setupTest(hooks);

  test("it aliases modelValue as value", function(assert) {
    var component = this.owner.factoryFor('component:inputs/password-input').create({
      modelValue: "asdf"
    });

    assert.equal(component.get("value"), "asdf");
    component.set("modelValue", "dupa.8");
    assert.equal(component.get("value"),  "dupa.8");
  });
});
