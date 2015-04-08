import Ember from "ember";

export default function(params, hash, options, env) {

  if (Ember.isArray(hash["additionalAttributeNames"].value())) {
    hash["additionalAttributeNames"].value().forEach(function(key) {
      hash[key] = env.data.view.getStream(key);
    });
  }
  delete hash["additionalAttributeNames"];
  env.helpers.component.helperFunction.call(this, params, hash, options, env);
}
