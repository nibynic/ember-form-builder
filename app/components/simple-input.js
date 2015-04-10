import Ember from "ember";
import ENV from "../config/environment";
import SimpleInput from "ember-simple-form/components/simple-input";

SimpleInput.reopen({
  configuration: Ember.computed(function() {
    return ENV.simpleForm;
  })
})

export default SimpleInput;
