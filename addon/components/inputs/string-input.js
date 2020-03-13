import classic from 'ember-classic-decorator';
import { reads, alias } from '@ember/object/computed';
import TextField from '@ember/component/text-field';

@classic
export default class StringInput extends TextField.extend(
  ...['autocomplete', 'autofocus', 'dir', 'disabled', 'inputmode', 'inputElementId',
   'list', 'name', 'pattern', 'readonly', 'size', 'tabindex'].map(
    (attr) => ({ [attr]: reads(`config.${attr}`) })
  )
) {
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
