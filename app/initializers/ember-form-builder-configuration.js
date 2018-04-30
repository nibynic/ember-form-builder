import Ember from "ember";
import configuration from "ember-form-builder/configuration";
import ENV from "../config/environment";

export var initialize = function(/* app */) {
  ENV.formBuilder = Ember.merge(configuration, ENV.formBuilder || {});
};

export default {
  name: "ember-form-builder-configuration",
  initialize: initialize
};
