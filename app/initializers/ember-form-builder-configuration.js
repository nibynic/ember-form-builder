import { merge } from '@ember/polyfills';
import configuration from "ember-form-builder/configuration";
import ENV from "../config/environment";
import { classify } from '@ember/string';

import FormBuilder from 'ember-form-builder/models/form-builder';
import EmberValidations from 'ember-form-builder/mixins/ember-validations';
import EmberCpValidations from 'ember-form-builder/mixins/ember-cp-validations';

const ValidationsMixins = {
  EmberValidations: EmberValidations,
  EmberCpValidations: EmberCpValidations
};

export var initialize = function(/* app */) {
  ENV.formBuilder = merge(configuration, ENV.formBuilder || {});

  let validationsMixin = ValidationsMixins[classify(ENV.formBuilder.validationsAddon)];
  if (validationsMixin) {
    FormBuilder.reopen(validationsMixin);
  }
};

export default {
  name: "ember-form-builder-configuration",
  initialize: initialize
};
