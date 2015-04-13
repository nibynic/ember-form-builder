import Ember from "ember";
import { test, moduleForComponent } from "ember-qunit";
import FormBuilder from "ember-simple-form/models/form-builder";
import submitOn from "ember-simple-form/helpers/submit-on";

test("it renders the simple submit component", function(assert) {
  var componentRendered = false;
  var formBuilder = "formBuilder";
  var environment = { helpers: { component: {
    helperFunction: function(params, hash, options, env) {
      componentRendered = true;

      assert.equal(params[0], "simple-submit");
      assert.equal(hash.on, formBuilder);
    }
  } } };

  submitOn([formBuilder], { }, null, environment);

  assert.ok(componentRendered, "Simple Submit component was rendered");
});
