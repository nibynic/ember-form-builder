import { module, test } from 'qunit';
import { setupTest } from "ember-qunit";

module("Date Input component", function(hooks) {
  setupTest(hooks);

  test("it aliases modelValue as value", function(assert) {
    var date1 = new Date(2010, 10, 1);
    var date2 = new Date(2015, 11, 12);
    var component = this.owner.factoryFor('component:inputs/date-input').create({
      modelValue: date1
    });

    assert.equal(component.get("value"), "2010-11-01");
    component.set("modelValue", date2);
    assert.equal(component.get("value"),  "2015-12-12");
  });

  test("it parses dates", function(assert) {
    var date = new Date(2015, 11, 12);
    var component = this.owner.factoryFor('component:inputs/date-input').create();

    component.set('value', '2015-12-12');

    assert.equal(component.get('modelValue').getTime(), date.getTime());

    component.set('value', '');

    assert.equal(component.get('modelValue'), undefined);
  });
});
