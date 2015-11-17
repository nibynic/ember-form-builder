import Ember from "ember";

var Stream = Ember.__loader.require("ember-metal/streams/stream").default;

export default {
  setupState: function(lastState, env, scope, params, hash) { // jshint ignore:line
    let componentPath = env.hooks.getValue(params[0]);
    return Object.assign({}, lastState, { componentPath, isComponentHelper: true });
  },

  render: function(morph, env, scope, params, hash, template, inverse, visitor) {
    processHash(env, hash);
    env.hooks.keywords.component.render(morph, env, scope, params, hash, template, inverse, visitor);
  },

  rerender: function(morph, env, scope, params, hash, template, inverse, visitor) {
    processHash(env, hash);
    env.hooks.keywords.component.rerender(morph, env, scope, params, hash, template, inverse, visitor);
  }
};

function processHash(env, hash) {
  if (hash.additionalAttributeNames && Ember.isArray(hash.additionalAttributeNames.value())) {
    hash["additionalAttributeNames"].value().forEach(function(key) {
      let literal = env.view.get(key);
      hash[key] = new Stream(function() { return literal; }, `(literal ${literal})`);
    });
  }
  delete hash["additionalAttributeNames"];
}
