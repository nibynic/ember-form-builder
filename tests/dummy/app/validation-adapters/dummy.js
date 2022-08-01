import EmberObject from '@ember/object';
import classic from 'ember-classic-decorator';
import { dependentKeyCompat } from '@ember/object/compat';

@classic
export default class DummyValidationAdapter extends EmberObject {
  validate() {
    return this.object.validate();
  }

  @dependentKeyCompat
  get attributes() {
    return this.object.validationsDummy;
  }
}
