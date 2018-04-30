import TextField from '@ember/component/text-field';
import InputDefaultsMixin from "ember-form-builder/mixins/input-defaults";

export default TextField.extend(InputDefaultsMixin, {
  type: "tel"
});
