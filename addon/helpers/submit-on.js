import Ember from "ember";

export default function(params, hash, options, env) {
  Ember.assert("You must provide 1 param: formBuilder", params.length === 1);

  hash.on = params[0];

  return env.helpers.component.helperFunction.call(this, ["simple-submit"], hash, options, env);
}
