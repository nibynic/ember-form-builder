import EmberObject from '@ember/object';
import classic from 'ember-classic-decorator';

@classic
export default class DummyValidationAdapter extends EmberObject {
  validate() {
    return this.object.validate();
  }

  get attributes() {
    return this.object.validationsDummy;
  }
}
