import Ember from "ember";
import { simpleInputAttributeNames } from "ember-simple-form/components/simple-input";

export default function(params, hash, options, env) {
  Ember.assert("You must provide 2 params: formBuilder and attributeName", params.length === 2);

  hash.on = params[0];
  hash.attr = params[1];
  var additionalAttributeNames = [];

  for(var key in hash) {
    if (simpleInputAttributeNames.indexOf(key) === -1) {
      additionalAttributeNames.push(key);
    }
  }
  hash.additionalAttributeNames = additionalAttributeNames;

  return env.helpers.component.helperFunction.call(this, ["simple-input"], hash, options, env);
}
