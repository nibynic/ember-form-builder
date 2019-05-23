import { assign } from '@ember/polyfills';
import configuration from "ember-form-builder/configuration";
import ENV from "../config/environment";
import { classify } from '@ember/string';

import FormBuilder from 'ember-form-builder/models/form-builder';
import EmberValidations from 'ember-form-builder/mixins/ember-validations';
import EmberCpValidations from 'ember-form-builder/mixins/ember-cp-validations';
import EmberData from 'ember-form-builder/mixins/ember-data';
import EmberOrbit from 'ember-form-builder/mixins/ember-orbit';

const ValidationsMixins = {
  EmberValidations: EmberValidations,
  EmberCpValidations: EmberCpValidations
};
const DataMixins = {
  EmberData: EmberData,
  EmberOrbit: EmberOrbit
};

export var initialize = function(/* app */) {
  ENV.formBuilder = assign(configuration, ENV.formBuilder || {});

  let validationsMixin = ValidationsMixins[classify(ENV.formBuilder.validationsAddon)];
  if (validationsMixin) {
    FormBuilder.reopen(validationsMixin);
  }

  let dataMixin = DataMixins[classify(ENV.formBuilder.dataAddon)];
  if (dataMixin) {
    FormBuilder.reopen(dataMixin);
  }
};

export default {
  name: "ember-form-builder-configuration",
  initialize: initialize
};
