import { module, test } from 'qunit';
import { setupTest } from "ember-qunit";

module("Text Input component", function(hooks) {
  setupTest(hooks);

  test("it aliases modelValue as value", function(assert) {
    var component = this.owner.factoryFor('component:inputs/text-input').create({
      modelValue: "asdf"
    });

    assert.equal(component.get("value"), "asdf");
    component.set("modelValue", "zxc");
    assert.equal(component.get("value"),  "zxc");
  });
});
