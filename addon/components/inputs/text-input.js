import classic from 'ember-classic-decorator';
import { reads, alias } from '@ember/object/computed';
import TextArea from '@ember/component/text-area';

@classic
export default class TextInput extends TextArea.extend(...['autocomplete', 'autofocus', 'dir', 'disabled', 'height', 'inputmode',
  'inputElementId', 'list', 'name', 'pattern', 'readonly', 'size', 'tabindex'].map(
  (attr) => ({ [attr]: reads(`config.${attr}`) })
)) {
  @alias('config.value')
  value;

  init() {
    super.init(...arguments);
    this.elementId = this.get('inputElementId');
  }

  @reads('config.validations.required')
  required;

  @reads('config.texts.placeholder')
  placeholder;
}
