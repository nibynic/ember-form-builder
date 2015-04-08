import Ember from "ember";
import { test, moduleForComponent } from "ember-qunit";
import FormBuilder from "ember-simple-form/models/form-builder";
import inputOn from "ember-simple-form/helpers/input-on";

test("it renders the simple input component with proper attributes", function(assert) {
  var componentRendered = false;
  var formBuilder = "formBuilder";
  var attr = "title";
  var type = "string";
  var environment = { helpers: { component: {
    helperFunction: function(params, hash, options, env) {
      componentRendered = true;

      assert.equal(params[0], "simple-input");
      assert.equal(hash.on, formBuilder);
      assert.equal(hash.attr, attr);
      assert.equal(hash.as, type);

      assert.equal(hash.additionalAttributeNames[0], "collection");
      assert.equal(hash.additionalAttributeNames[1], "optionLabelPath");
      assert.equal(hash.additionalAttributeNames[2], "optionValuePath");
    }
  } } };

  inputOn([formBuilder, attr], {
    as: type,
    collection: [],
    optionLabelPath: "description",
    optionValuePath: "slug"
  }, null, environment);

  assert.ok(componentRendered, "Simple Input component was rendered");
});
