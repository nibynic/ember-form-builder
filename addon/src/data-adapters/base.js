import EmberObject from '@ember/object';
import classic from 'ember-classic-decorator';

@classic
export default class Base extends EmberObject {
  isModel() {}

  get model() {
    return this.isModel(this.object.model) ? this.object.model : this.object;
  }
}
