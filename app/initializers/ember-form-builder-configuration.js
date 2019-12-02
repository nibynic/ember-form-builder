import { assign } from '@ember/polyfills';
import configuration from "ember-form-builder/configuration";
import ENV from "../config/environment";
import { classify } from '@ember/string';

import FormBuilder from 'ember-form-builder/models/form-builder';
// import EmberData from 'ember-form-builder/mixins/ember-data';
// import EmberOrbit from 'ember-form-builder/mixins/ember-orbit';

const DataMixins = {
  // EmberData: EmberData,
  // EmberOrbit: EmberOrbit
};

export var initialize = function(/* app */) {
  ENV.formBuilder = assign(configuration, ENV.formBuilder || {});

  let dataMixin = DataMixins[classify(ENV.formBuilder.dataAddon)];
  if (dataMixin) {
    FormBuilder.reopen(dataMixin);
  }
};

export default {
  name: "ember-form-builder-configuration",
  initialize: initialize
};
