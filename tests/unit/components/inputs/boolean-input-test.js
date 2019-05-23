import { module, test } from 'qunit';
import { setupTest } from "ember-qunit";

module("Boolean Input component", function(hooks) {
  setupTest(hooks);

  test("it aliases modelValue as value and checked", function(assert) {
    var component = this.owner.factoryFor('component:inputs/boolean-input').create({
      modelValue: true
    });

    assert.equal(component.get("value"), true);
    assert.equal(component.get("checked"), true);
    component.set("modelValue", false);
    assert.equal(component.get("value"), false);
    assert.equal(component.get("checked"), false);
  });
});
