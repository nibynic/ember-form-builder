import EmberObject from '@ember/object';
import { dependentKeyCompat } from '@ember/object/compat';

export default class DummyValidationAdapter extends EmberObject {
  validate() {
    if (this.object?.validate) {
      return this.object.validate();
    }
  }

  @dependentKeyCompat
  get attributes() {
    return this.object?.validationsDummy;
  }
}
