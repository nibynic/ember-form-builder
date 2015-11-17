import Ember from "ember";

export default {
  setupState: function(lastState, env, scope, params, hash) { // jshint ignore:line
    Ember.assert("You must provide 1 param: formBuilder", params.length === 1);

    return Object.assign({}, lastState, { });
  },

  render: function(morph, env, scope, params, hash, template, inverse, visitor) {
    hash.on = params[0];

    env.hooks.component(morph, env, scope, "simple-submit", [], hash, { default: template, inverse }, visitor);
  },

  rerender: function(...args) {
    this.render(...args);
  }
};
