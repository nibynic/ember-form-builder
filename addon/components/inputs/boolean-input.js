import Checkbox from '@ember/component/checkbox';
import { alias, reads } from '@ember/object/computed';

export default Checkbox.extend({
  attributeBindings: ['autocomplete'],

  checked: alias('config.value'),

  init() {
    this._super(...arguments);
    this.elementId = this.get('config.elementId');
  },

  required: reads('config.validations.required')
}, ...['autocomplete', 'autofocus', 'disabled', 'form', 'indeterminate', 'name',
  'readonly', 'tabindex'].map(
  (attr) => ({ [attr]: reads(`config.${attr}`) })
));
