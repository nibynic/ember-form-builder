import Ember from "ember";
import { test, moduleForComponent } from "ember-qunit";

moduleForComponent("simple-form");

test("it renders with the right props", function(assert) {
  var component = this.subject();

  assert.equal(component._state, "preRender");

  this.render();

  assert.equal(component._state, "inDOM");
});

test("it inserts a form tag into DOM", function(assert) {
  var component = this.subject();
  this.render();

  assert.ok(component.$().is("form"));
});
