import EmberObject from '@ember/object';

export default class Base extends EmberObject {
  isModel() {}

  get model() {
    return this.isModel(this.object.model) ? this.object.model : this.object;
  }
}
