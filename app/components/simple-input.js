import Ember from "ember";
import ENV from "../config/environment";
import SimpleInput from "ember-form-builder/components/simple-input";

SimpleInput.reopen({
  configuration: Ember.computed(function() {
    return ENV.formBuilder;
  })
})

export default SimpleInput;
