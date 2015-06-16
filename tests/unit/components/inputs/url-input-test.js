import Ember from "ember";
import { test, moduleForComponent } from "ember-qunit";

moduleForComponent("inputs/url-input", "Url Input component");

test("it aliases modelValue as value", function(assert) {
  var component = this.subject({
    modelValue: "http://foo.bar"
  });

  assert.equal(component.get("value"), "http://foo.bar");
  component.set("modelValue", "http://bar.foo");
  assert.equal(component.get("value"),  "http://bar.foo");
});
