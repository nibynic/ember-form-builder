import { module, test } from 'qunit';
import { setupTest } from "ember-qunit";

module("Url Input component", function(hooks) {
  setupTest(hooks);

  test("it aliases modelValue as value", function(assert) {
    var component = this.owner.factoryFor('component:inputs/url-input').create({
      modelValue: "http://foo.bar"
    });

    assert.equal(component.get("value"), "http://foo.bar");
    component.set("modelValue", "http://bar.foo");
    assert.equal(component.get("value"),  "http://bar.foo");
  });
});
