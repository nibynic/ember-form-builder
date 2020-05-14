import EmberObject, { computed } from '@ember/object';

export default class Base extends EmberObject {
  isModel() {}

  @computed('object.model')
  get model() {
    return this.isModel(this.object.model) ?
      this.object.model :
      this.object;
  }
}
