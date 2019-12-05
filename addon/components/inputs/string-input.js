import TextField from '@ember/component/text-field';
import { alias, reads } from '@ember/object/computed';

export default TextField.extend({
  value: alias('config.value'),

  init() {
    this._super(...arguments);
    this.elementId = this.get('inputElementId');
  },

  required: reads('config.validations.required'),
  placeholder: reads('config.texts.placeholder'),
},
...['autocomplete', 'autofocus', 'dir', 'disabled', 'inputmode', 'inputElementId',
 'list', 'name', 'pattern', 'size', 'tabindex'].map(
  (attr) => ({ [attr]: reads(`config.${attr}`) })
));
