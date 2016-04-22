import { test, moduleForComponent } from "ember-qunit";

moduleForComponent("inputs/date-input", "Date Input component");

test("it aliases modelValue as value", function(assert) {
  var date1 = new Date(2010, 10, 1);
  var date2 = new Date(2015, 11, 12);
  var component = this.subject({
    modelValue: date1
  });

  assert.equal(component.get("value"), "2010-11-01");
  component.set("modelValue", date2);
  assert.equal(component.get("value"),  "2015-12-12");
});
