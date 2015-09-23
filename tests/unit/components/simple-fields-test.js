import Ember from "ember";
import { test, moduleForComponent } from "ember-qunit";
import FormBuilder from "ember-simple-form/models/form-builder";

var parentFormBuilder;
var parentModel;

moduleForComponent("simple-fields", "Simple Fields component", {
  beforeEach: function() {
    parentModel = Ember.Object.create({ title: "Testing testing 123" });
    parentFormBuilder = FormBuilder.create({
      object: parentModel
    });
  },

  afterEach: function() {
    parentModel = null;
    parentFormBuilder = null;
  }
});

test("it renders with the right props", function(assert) {
  var object = Ember.Object.create();
  var component = this.subject({
    on: parentFormBuilder,
    for: object
  });

  assert.equal(component._state, "preRender");

  this.render();

  assert.equal(component._state, "inDOM");
});

test("it registers and unregisters itself with the parent form builder", function(assert) {
  var object = Ember.Object.create();
  var component = this.subject({
    on: parentFormBuilder,
    for: object
  });

  this.render();

  assert.equal(parentFormBuilder.get("children.lastObject"), component.get("formBuilder"));
  assert.equal(component.get("formBuilder.object"), object);

  component.willDestroy();

  assert.equal(parentFormBuilder.get("children.length"), 0);
});
