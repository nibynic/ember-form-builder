import classic from 'ember-classic-decorator';
import { attributeBindings } from '@ember-decorators/component';
import { reads, alias } from '@ember/object/computed';
import Checkbox from '@ember/component/checkbox';

@classic
@attributeBindings('autocomplete')
export default class BooleanInput extends Checkbox.extend(
  ...['autocomplete', 'autofocus', 'disabled', 'form', 'indeterminate', 'name',
    'readonly', 'tabindex'].map(
    (attr) => ({ [attr]: reads(`config.${attr}`) })
  )
) {
  @alias('config.value')
  checked;

  init() {
    super.init(...arguments);
    this.elementId = this.get('config.elementId');
  }

  @reads('config.validations.required')
  required;
}
