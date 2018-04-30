import { alias } from '@ember/object/computed';
import Checkbox from '@ember/component/checkbox';
import InputDefaultsMixin from "ember-form-builder/mixins/input-defaults";

export default Checkbox.extend(InputDefaultsMixin, {
  checked: alias("value")
});
