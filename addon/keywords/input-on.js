import Ember from "ember";
import { simpleInputAttributeNames } from "ember-simple-form/components/simple-input";

var assign = Ember.__loader.require("ember-metal/merge").assign;

export default {
  setupState: function(lastState, env, scope, params, hash) { // jshint ignore:line
    Ember.assert("You must provide 2 params: formBuilder and attributeName", params.length === 2);
    let componentPath = "simple-input";

    return assign({}, lastState, { componentPath, isComponentHelper: true });
  },

  render: function(morph, env, scope, params, hash, template, inverse, visitor) {
    processParams(params, hash);

    env.hooks.keywords.component.render(morph, env, scope, params, hash, template, inverse, visitor);
  },

  rerender: function(morph, env, scope, params, hash, template, inverse, visitor) {
    processParams(params, hash);

    env.hooks.keywords.component.rerender(morph, env, scope, params, hash, template, inverse, visitor);
  }
};

function processParams(params, hash) {
  hash.on = params[0];
  hash.attr = params[1];

  var additionalAttributeNames = [];

  for(var key in hash) {
    if (simpleInputAttributeNames.indexOf(key) === -1) {
      additionalAttributeNames.push(key);
    }
  }
  hash.additionalAttributeNames = additionalAttributeNames;
}
