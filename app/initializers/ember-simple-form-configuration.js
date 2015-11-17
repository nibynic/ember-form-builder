import Ember from "ember";
import configuration from "ember-simple-form/configuration";
import ENV from "../config/environment";

export var initialize = function(app) {
  ENV.simpleForm = Ember.merge(configuration, ENV.simpleForm || {});
}

export default {
  name: "ember-simple-form-configuration",
  initialize: initialize
};
