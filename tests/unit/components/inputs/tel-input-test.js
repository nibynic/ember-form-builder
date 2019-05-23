import { module, test } from 'qunit';
import { setupTest } from "ember-qunit";

module("Tel Input component", function(hooks) {
  setupTest(hooks);

  test("it aliases modelValue as value", function(assert) {
    var component = this.owner.factoryFor('component:inputs/tel-input').create({
      modelValue: "0700606060"
    });

    assert.equal(component.get("value"), "0700606060");
    component.set("modelValue", "0800801801");
    assert.equal(component.get("value"),  "0800801801");
  });
});
