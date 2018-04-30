import { computed } from '@ember/object';
import ENV from "../config/environment";
import SimpleInput from "ember-form-builder/components/simple-input";

SimpleInput.reopen({
  configuration: computed(function() {
    return ENV.formBuilder;
  })
});

export default SimpleInput;
