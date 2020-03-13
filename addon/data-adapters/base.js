import classic from 'ember-classic-decorator';
import EmberObject, { computed } from '@ember/object';

@classic
export default class Base extends EmberObject {
  isModel() {}

  @computed('object.model')
  get model() {
    return this.isModel(this.get('object.model')) ?
      this.get('object.model') :
      this.get('object');
  }
}
