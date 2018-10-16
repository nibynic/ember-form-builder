import EmberObject from '@ember/object';
import { test, moduleForComponent } from "ember-qunit";
import FormBuilder from "ember-form-builder/models/form-builder";

var parentFormBuilder;
var parentModel;

moduleForComponent("fields-builder", "Simple Fields component", {
  unit: true,
  beforeEach: function() {
    parentModel = EmberObject.create({ title: "Testing testing 123" });
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
  var object = EmberObject.create();
  var component = this.subject({
    on: parentFormBuilder,
    for: object
  });

  assert.equal(component._state, "preRender");

  this.render();

  assert.equal(component._state, "inDOM");
});

test("it registers and unregisters itself with the parent form builder", function(assert) {
  var object = EmberObject.create();
  var component = this.subject({
    on: parentFormBuilder,
    for: object
  });

  this.render();

  assert.equal(parentFormBuilder.get("children.lastObject"), component.get("formBuilder"));
  assert.equal(component.get('formBuilder.parent'), parentFormBuilder);
  assert.equal(component.get("formBuilder.object"), object);

  component.willDestroy();

  assert.equal(parentFormBuilder.get("children.length"), 0);
  assert.equal(component.get('formBuilder.parent'), null);
});

test("it registers and unregisters itself with the parent form builder", function(assert) {
  var object = EmberObject.create();
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

test("it sets name", function(assert) {
  parentFormBuilder.set('name', 'sampleModel');
  var component = this.subject({
    as: 'sample-child',
    on: parentFormBuilder
  });

  this.render();

  assert.equal(component.get('formBuilder.name'), 'sampleModel[sampleChild]');
});
