import TextArea from '@ember/component/text-area';
import { alias, reads } from '@ember/object/computed';

export default TextArea.extend({
  value: alias('config.value'),

  init() {
    this._super(...arguments);
    this.elementId = this.get('inputElementId');
  },

  required: reads('config.validations.required'),
  placeholder: reads('config.texts.placeholder')
},
...['autocomplete', 'autofocus', 'dir', 'disabled', 'height', 'inputmode',
  'inputElementId', 'list', 'name', 'pattern', 'readonly', 'size', 'tabindex'].map(
  (attr) => ({ [attr]: reads(`config.${attr}`) })
));
